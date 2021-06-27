var HtmlController = function(sceneController)
{
  this.sceneController = sceneController;
}

HtmlController.prototype.setup = function()
{
	window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

  document.addEventListener("keydown", this.onDocumentKeyDown.bind(this), false);
  document.addEventListener("mousedown", this.onDocumentMouseDown.bind(this), false);
  document.addEventListener("mousemove", this.onDocumentMouseMove.bind(this), false);
  document.addEventListener("mouseup", this.onDocumentMouseUp.bind(this), false);
}

HtmlController.prototype.onWindowResize = function()
{
  this.sceneController.camera.aspect = window.innerWidth / window.innerHeight;
  this.sceneController.camera.updateProjectionMatrix();

  this.sceneController.renderer.setSize( window.innerWidth, window.innerHeight);
  this.sceneController.render();
}

HtmlController.prototype.onDocumentMouseDown = function(event)
{ }

HtmlController.prototype.onDocumentMouseMove = function(event)
{ }

HtmlController.prototype.onDocumentMouseUp = function(event)
{ }


HtmlController.prototype.onDocumentKeyDown = function(event) {
    switch(event.key)
    {
      case "r": // r
        this.sceneController.controls.reset();
        break;
      case "ArrowLeft":
        break;
      case "ArrowRight":
        break;
      case "ArrowUp":
        break;
      case "ArrowDown":
        break;
      case "k":
        break;
      case "l":
        break;
    }
    this.sceneController.render();
};
