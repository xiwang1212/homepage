function degToRad(deg)
{
  return deg * 0.0174532925;
}
function radToDeg(rad)
{
  return rad * 57.2958;
}

THREE.Vector3.XAxis = new THREE.Vector3( 1, 0, 0 );
THREE.Vector3.YAxis = new THREE.Vector3( 0, 1, 0 );
THREE.Vector3.ZAxis = new THREE.Vector3( 0, 0, 1 );

//takes a array with 9 elements (column first upper left matrix3 of matrix4) and returns rotation matrix4
function matrix3ToMatrix4(rotationArray)
{
    var m4 = new THREE.Matrix4();
    m4.elements[0] = rotationArray[0];
    m4.elements[1] = rotationArray[1];
    m4.elements[2] = rotationArray[2];

    m4.elements[4] = rotationArray[3];
    m4.elements[5] = rotationArray[4];
    m4.elements[6] = rotationArray[5];

    m4.elements[8] = rotationArray[6];
    m4.elements[9] = rotationArray[7];
    m4.elements[10] = rotationArray[8];

    return m4;
}

//takes a 3 arrays with 3 elements and returns matrix4
function scaleVectorsToMatrix4(scale1, scale2, scale3)
{
    var m4 = new THREE.Matrix4();
    m4.elements[0] = scale1[0];
    m4.elements[1] = scale1[1];
    m4.elements[2] = scale1[2];

    m4.elements[4] = scale2[0];
    m4.elements[5] = scale2[1];
    m4.elements[6] = scale2[2];

    m4.elements[8] = scale3[0];
    m4.elements[9] = scale3[1];
    m4.elements[10] = scale3[2];

    return m4;
}

function saveText(text, filename){
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
  a.setAttribute('download', filename);
  a.click()
}
