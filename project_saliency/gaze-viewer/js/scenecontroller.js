var SceneController = function(document)
{
    this.scene = new THREE.Scene();
    this.stats = new Stats();
  	this.renderer = new THREE.WebGLRenderer( { antialias: true } );

    this.fixationEllipses = new THREE.Group();
    this.directions = [];
    this.currentModelName = "";

    this.gui = new dat.GUI({width:280});

    this.materialBoth =  new THREE.MeshPhongMaterial();
    this.materialBoth.color = new THREE.Color(0xa5fabe);

    this.materialABS = new THREE.MeshStandardMaterial();
    this.materialABS.roughness = 0.0;
    this.materialABS.metalness = 0.4;
    this.materialABS.emissive = new THREE.Color(0x202020);

    this.materialSandstone = new THREE.MeshStandardMaterial();
    this.materialSandstone.roughness = 1.0;
    this.materialSandstone.metalness = 0.0;

    this.modelNames = [ 'bunny', 'casting', 'face', 'game_controller', 'hand', 'hay', 'planck', 'ring', 'rockarm', 'sofa', 'space_shuttle', 'spanner', 'starfish', 'teapot', 'vase', 'watchtower'];
}

SceneController.prototype.setup = function()
{
  	this.renderer.setSize( window.innerWidth, window.innerHeight);
  	document.body.appendChild( this.renderer.domElement );

    this.stats.showPanel( 0 );
    document.body.appendChild( this.stats.dom );

    this.setupGUI();
    this.setupCamera();
    this.setupControls();
    this.setupLight();

    this.updateModel();
    this.fixViewingDirection();

    this.render();
    this.animate();
}

SceneController.prototype.setupCamera = function()
{
  var VIEW_ANGLE = 70;
  var ASPECT_RATIO = window.innerWidth / window.innerHeight;
  var NEAR_PLANE = 0.01;
  var FAR_PLANE = 2000;

	this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT_RATIO, NEAR_PLANE, FAR_PLANE );
	this.camera.position.set(0,150,250);
  this.camera.lookAt(this.scene.position);
}

SceneController.prototype.setupControls = function()
{
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
				this.controls.rotateSpeed = 3.0;
				this.controls.zoomSpeed = 1.2;
				this.controls.panSpeed = 0.8;
				this.controls.keys = [ 65, 83, 68 ];
				this.controls.addEventListener( 'change', this.render.bind(this) );
}

SceneController.prototype.setupGeometry = function(nameOfModel)
{
	var loader = new THREE.JSONLoader();
	var parsedGeometry = loader.parse(window[nameOfModel]);

  	this.material = new THREE.MeshPhongMaterial();
	this.mesh = new THREE.Mesh(parsedGeometry.geometry, this.material);

    this.scene.add(this.mesh);
}

SceneController.prototype.setupLight = function()
{
  var light = new THREE.PointLight( 0xffffcc, .7 );
  light.position.set( -100, 100, 150 );
  this.scene.add(light);

  var light2 = new THREE.PointLight( 0xffffff, .4 );
  light2.position.set( 100, 100, -150 );
  this.scene.add(light2);

  this.scene.add( new THREE.AmbientLight(0xcccccc, 0.4));
}

SceneController.prototype.render = function()
{
  this.renderer.render( this.scene, this.camera );
  this.stats.update();
}

SceneController.prototype.setupGUI = function()
{
    this.modelParams = {
        screenController : this,
        model : "bunny",
        material : "both",
        showAllDirections : false,
        direction1 : true,
        direction2 : false,
        direction3 : false,
        direction4 : false,
        direction5 : false,
        direction6 : false,
        direction7 : false,
        fixViewingDirection : function(){this.screenController.fixViewingDirection();},
        scaleEllipses : .5,
        filterEllipsoids : true,
        maxAxisLength : 60,
        cvFilterEnabled : true,
        cvFilter : .8,
        save: function(){this.screenController.saveCurrentData();}
    };

    this.updateDirections();

    var modelGui = this.gui.addFolder('Visualization');
    modelGui.add(this.modelParams, 'model', this.modelNames).name('Model').onChange(function(newValue){this.object.screenController.updateModel()});
    modelGui.add(this.modelParams, 'material', [ 'both', 'ABS', 'sandstone' ] ).name('Material').onChange(function(newValue){this.object.screenController.updateModel()});
    this.fixViewingDirButton = modelGui.add(this.modelParams, "fixViewingDirection").name("Set view");


    modelGui.add(this.modelParams, "direction1").name("View 1 (45 deg)").onChange(function(newValue){this.object.screenController.updateDirections(); this.object.screenController.updateModel()});
    modelGui.add(this.modelParams, "direction2").name("View 2 (30 deg)").onChange(function(newValue){this.object.screenController.updateDirections(); this.object.screenController.updateModel()});
    modelGui.add(this.modelParams, "direction3").name("View 3 (15 deg)").onChange(function(newValue){this.object.screenController.updateDirections(); this.object.screenController.updateModel()});
    modelGui.add(this.modelParams, "direction4").name("View 4 (0 deg)").onChange(function(newValue){this.object.screenController.updateDirections(); this.object.screenController.updateModel()});
    modelGui.add(this.modelParams, "direction5").name("View 5 (-15 deg)").onChange(function(newValue){this.object.screenController.updateDirections(); this.object.screenController.updateModel()});
    modelGui.add(this.modelParams, "direction6").name("View 6 (-30 deg)").onChange(function(newValue){this.object.screenController.updateDirections(); this.object.screenController.updateModel()});
    modelGui.add(this.modelParams, "direction7").name("View 7 (-45 deg)").onChange(function(newValue){this.object.screenController.updateDirections(); this.object.screenController.updateModel()});

    this.showAllDirectionsButton = modelGui.add(this.modelParams, "showAllDirections").name("All directions").onChange(function(newValue){this.object.screenController.updateModel()});

    modelGui.add(this.modelParams, "scaleEllipses", 0.1, 1 ).name("Scale ellipsoids").onChange(function(newValue){this.object.screenController.updateModel()});

    // used to add new data to model files.
    // this changed so we read the critical values directly from a js file and add it to the data
    // modelGui.add(this.modelParams, "save");

    modelGui.open();

    var filterGui = this.gui.addFolder('Filter');
    filterGui.add(this.modelParams, "cvFilterEnabled").name("Filter by confidence").onChange(function(newValue){this.object.screenController.updateModel()});
    filterGui.add(this.modelParams, "cvFilter", 0.1, 1.0 ).name("Max confidence").onChange(function(newValue){this.object.screenController.updateModel()});

    filterGui.add(this.modelParams, "filterEllipsoids").name("Filter by length").onChange(function(newValue){this.object.screenController.updateModel()});
    filterGui.add(this.modelParams, "maxAxisLength", 2, 100 ).name("Max axis length").onChange(function(newValue){this.object.screenController.updateModel()});
    filterGui.open();

    this.gui.open()
};

SceneController.prototype.saveCurrentData = function ()
{
  saveText(JSON.stringify(this.gazeData, null, 1), this.modelParams.model + "_data.js");
};

SceneController.prototype.updateModel = function()
{
    if(this.modelParams.showAllDirections || !this.canFixViewingDirection())
    {
      this.fixViewingDirButton.domElement.style.pointerEvents = "none"
      this.fixViewingDirButton.domElement.style.opacity = .5;
      this.controls.enabled = true;
    }else {
      this.fixViewingDirButton.domElement.style.pointerEvents = "auto"
      this.fixViewingDirButton.domElement.style.opacity = 1.0;
    }

    var newModelName = this.modelParams.model;

    var meshName = newModelName + "_model";
    var dataName = newModelName + "_data";

    var critical_scale_values = newModelName + "_cv";
    this.critical_values = window[critical_scale_values].critical_values;

    this.data = window[dataName];

    this.updateDataModel();

    if(this.currentModelName !== newModelName)
    {
      this.scene.remove(this.mesh);
      this.setupGeometry(meshName);
      this.currentModelName = newModelName;
    }

    if(this.modelParams.material == "ABS")
    {
        this.material = this.materialABS;
    }else if(this.modelParams.material == "sandstone")
    {
        this.material = this.materialSandstone;
    }else
    {
        this.material = this.materialBoth;
    }

    this.mesh.material = this.material;

    this.renderGazeData();
    this.render();
}

SceneController.prototype.updateDataModel = function()
{
    this.gazeData = [];

    for(var i = 0; i < this.data.length; i++)
    {
      var currentData = this.data[i];

      var correctMaterial = this.modelParams.material === "both" || (currentData.condition.material === this.modelParams.material)
      var correctDirection = this.modelParams.showAllDirections || this.directions[currentData.condition.direction];

      if(correctMaterial && correctDirection)
      {
        this.gazeData.push(currentData);
      }
    }
}

SceneController.prototype.renderGazeData = function()
{
    this.scene.remove(this.fixationEllipses);
    this.fixationEllipses.children = [];

    // used to load critical value data
    // list with value first contains ABS, then sandstone material data
    var fixationRunner = 0;

    for(var i = 0; i < this.gazeData.length; i++)
    {
        var translationToModel = new THREE.Matrix4().makeTranslation(-this.gazeData[i].condition.offset[0],-this.gazeData[i].condition.offset[1],-this.gazeData[i].condition.offset[2]);
        var rotationToModel = matrix3ToMatrix4(this.gazeData[i].condition.orientation);

        var fixations = this.gazeData[i].fixations;
        var filterCurrent = false;

        var maxAxisLengthSq = this.modelParams.maxAxisLength * this.modelParams.maxAxisLength;

        for(var f = 0; f < fixations.length; f++)
        {
          var fixation = fixations[f];

          if(this.modelParams.filterEllipsoids)
          {
              for(var s = 0; s < fixation.ellipsoid.semiaxes.length && !filterCurrent; s++)
              {
                var axis = new THREE.Vector3().fromArray(fixation.ellipsoid.semiaxes[s]);
                if(axis.lengthSq() > maxAxisLengthSq)
                  filterCurrent = true;
              }
          }

          // get critical value data from critical_scale_values.js and add to fixation data
          var criticalScaleValue = this.critical_values[fixationRunner];
          fixationRunner++;
          this.gazeData[i].fixations[f].critical_scale_value = criticalScaleValue;

          filterCurrent = filterCurrent || (this.modelParams.cvFilterEnabled && fixation.critical_scale_value > this.modelParams.cvFilter);

          if(!filterCurrent)
          {
            var position = new THREE.Vector3().fromArray(fixation.position);
            var positionMatrix = new THREE.Matrix4().makeTranslation(position.x,position.y,position.z);

            var ellipsoidCenter = new THREE.Vector3().fromArray(fixation.ellipsoid.center);
            var ellipsoidCenterMatrix = new THREE.Matrix4().makeTranslation(ellipsoidCenter.x,ellipsoidCenter.y,ellipsoidCenter.z);

            var ellipsoidSemiaxesMatrix = scaleVectorsToMatrix4(fixation.ellipsoid.semiaxes[0],fixation.ellipsoid.semiaxes[1],fixation.ellipsoid.semiaxes[2]);
            var globalScaleMatrix = new THREE.Matrix4().makeScale(this.modelParams.scaleEllipses, this.modelParams.scaleEllipses, this.modelParams.scaleEllipses);

            var fixationEllipsoidMesh = this.getNewEllipsoidMesh(1, 1, 1, 1);
            fixationEllipsoidMesh.applyMatrix(globalScaleMatrix);
            fixationEllipsoidMesh.applyMatrix(ellipsoidSemiaxesMatrix);
            fixationEllipsoidMesh.applyMatrix(positionMatrix);
            fixationEllipsoidMesh.applyMatrix(translationToModel);
            fixationEllipsoidMesh.applyMatrix(rotationToModel);
            this.fixationEllipses.add(fixationEllipsoidMesh);
          }
        }
    }

    this.scene.add(this.fixationEllipses);
}

SceneController.prototype.fixViewingDirection = function()
{
    if(this.modelParams.showAllDirections || !this.canFixViewingDirection())
      return;

    var angle = this.getViewingAngleInDegree();

    this.controls.reset();

    var posX = 250 * Math.sin(degToRad(angle));
    var posZ = 250 * Math.sin(degToRad(90 - angle));

    this.camera.position.set(posX,150,posZ);
    this.camera.lookAt(0,0,0);
}

SceneController.prototype.animate = function()
{
	requestAnimationFrame( this.animate.bind(this) );
  this.stats.update();
	this.controls.update();
}

SceneController.prototype.getNewEllipsoidMesh = function(radius, xScale, yScale, zScale, ellipsoidColor = 0xff0000)
{
  var ellipsoidGeometry = new THREE.SphereGeometry( radius, 12, 12 );
  var ellipsoidMaterial = new THREE.MeshLambertMaterial( { color : ellipsoidColor , side: THREE.DoubleSide} );

  var ellipsoid = new THREE.Mesh( ellipsoidGeometry, ellipsoidMaterial );
  return ellipsoid;
}

SceneController.prototype.updateDirections = function()
{
  this.directions["0"] = this.modelParams.direction1;
  this.directions["1"] = this.modelParams.direction2;
  this.directions["2"] = this.modelParams.direction3;
  this.directions["3"] = this.modelParams.direction4;
  this.directions["4"] = this.modelParams.direction5;
  this.directions["5"] = this.modelParams.direction6;
  this.directions["6"] = this.modelParams.direction7;
}

SceneController.prototype.canFixViewingDirection = function()
{
  var count = 0;
  count = this.directions["0"] ? count + 1 : count;
  count = this.directions["1"] ? count + 1 : count;
  count = this.directions["2"] ? count + 1 : count;
  count = this.directions["3"] ? count + 1 : count;
  count = this.directions["4"] ? count + 1 : count;
  count = this.directions["5"] ? count + 1 : count;
  count = this.directions["6"] ? count + 1 : count;
  return count == 1;
}

SceneController.prototype.getViewingAngleInDegree = function()
{
    if(this.directions["0"]) return -45;
    if(this.directions["1"]) return -30;
    if(this.directions["2"]) return -15;
    if(this.directions["3"]) return 0;
    if(this.directions["4"]) return 15;
    if(this.directions["5"]) return 30;
    if(this.directions["6"]) return 45;

    return 0;
}
