Cursor = {};
Cursor.init = function(img_path){
    Cursor.x = 0;
    Cursor.y = 0;
    Cursor.gridX = -9;
    Cursor.gridY = -9;
    Cursor.txt =  THREE.ImageUtils.loadTexture(img_path);
    Cursor.mesh =  new THREE.Mesh(
                    new THREE.PlaneGeometry(KGDN.pieceSize, KGDN.pieceSize,0),
                    new THREE.MeshBasicMaterial({map: Cursor.txt,
                                                 transparent: true,
                                                 opacity: 1,
                                                // blending: "AdditiveBlending"
                                                }));
    Cursor.mesh.position.set(0,0,-150);
    Cursor.mesh.geometry.dynamic = true; 
    window.onmousemove = Cursor.update;

};

var curscount = 0;
Cursor.update = function(event){
    Cursor.x = event.clientX;
    Cursor.y = event.clientY;
      var vector = new THREE.Vector3(
        (-event.clientX / window.innerWidth ) * 2 + 1,
          (event.clientY / window.innerHeight ) * 2 -1,
        0.5 );
    KGDN.projector.unprojectVector(vector, KGDN.camera);
    dir = vector.sub(KGDN.camera.position).normalize();
    ray = new THREE.Raycaster(KGDN.camera.position, dir );
    distance = - dir.clone().multiplyScalar(KGDN.tileGrid.position.z/dir.z).length();
    console.log(distance);
    var newVec = KGDN.camera.position.clone().add(dir.multiplyScalar(distance)); 
    newVec.z = KGDN.tileGrid.position.z;
    newVec.x = Math.round(newVec.x /6.6)*6.6;
    newVec.y = Math.round(newVec.y /6.6)*6.6;
    Cursor.mesh.position.set(newVec.x,newVec.y,newVec.z);
    KGDN.camera.position.x = (event.clientX - window.innerWidth/2)/60;
    KGDN.camera.position.y = -(event.clientY - window.innerHeight/2) /60;
};
