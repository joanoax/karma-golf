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

    Cursor.mesh.position.set(0,0,KGDN.tileGrid.position.z + 10);
   //  Cursor.light.target = Cursor.mesh.position;
    Cursor.mesh.geometry.dynamic = true; 

       
  //  KGDN.scene.add(Cursor.light);
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
    //console.log(distance);
    var newVec = KGDN.camera.position.clone().add(dir.multiplyScalar(distance)); 
    newVec.z = KGDN.tileGrid.position.z;

    newVec.x= -Math.round(( KGDN.tileGrid.position.x - newVec.x - 50) /KGDN.pieceSize);
    newVec.y = - Math.round((KGDN.tileGrid.position.y + newVec.y  - 50) /KGDN.pieceSize);

    newVec.x = Math.min(Math.max(0, newVec.x) , KGDN.grid[0]-1);
    newVec.y  = Math.min(Math.max(0, newVec.y) , KGDN.grid[1]-1);
    if(Pieces.grid[newVec.x][newVec.y] == 0){
        Cursor.gridX = newVec.x; 
        Cursor.gridY = newVec.y;
    }
    KGDN.placeOnGrid(Cursor.mesh,Cursor.gridX,Cursor.gridY,KGDN.tileGrid.position.z + 2);
    KGDN.placeOnGrid(KGDN.cursLight,Cursor.gridX,Cursor.gridY,KGDN.tileGrid.position.z + 30);
//    console.log(KGDN.cursLight.position.x + " " + KGDN.cursLight.position.y);
    KGDN.camera.position.x = (event.clientX - window.innerWidth/2)/60;
    KGDN.camera.position.y = -(event.clientY - window.innerHeight/2) /60;
};
