Cursor = {};
Cursor.arrowScale = 162/128;
Cursor.init = function(img_path){
    Cursor.x = 0;
    Cursor.y = 0;
    Cursor.gridX = -9;
    Cursor.gridY = -9;
    Cursor.txt =  THREE.ImageUtils.loadTexture(img_path);
    Cursor.arrowTxt = THREE.ImageUtils.loadTexture("/img/cursorArrow.png");
    Cursor.mesh =  new THREE.Mesh(
                    new THREE.PlaneGeometry(KGDN.pieceSize, KGDN.pieceSize,0),
                    new THREE.MeshBasicMaterial({map: Cursor.txt,
                                                 transparent: true,
                                                 opacity: 1,
                                                // blending: "AdditiveBlending"
                                                }));
    Cursor.arrow = new THREE.Mesh(
                    new THREE.PlaneGeometry(KGDN.pieceSize * Cursor.arrowScale , KGDN.pieceSize * Cursor.arrowScale,0),
                    new THREE.MeshBasicMaterial({map: Cursor.arrowTxt,
                                                 transparent: true,
                                                 opacity: 0,
                                                // blending: "AdditiveBlending"
                                                }));
    Cursor.arrow.position.set(0,0,0.2);

    Cursor.group = new THREE.Object3D();
    Cursor.group.add(Cursor.arrow);
    Cursor.group.add(Cursor.mesh);
    

    Cursor.group.position.set(0,0,KGDN.tileGrid.position.z + 10);
   //  Cursor.light.target = Cursor.mesh.position;
    Cursor.mesh.geometry.dynamic = true; 
      Cursor.arrow.geometry.dynamic = true; 
       
  //  KGDN.scene.add(Cursor.light);


};

Cursor.trim = function(){
    if(KGDN.trimsLeft <= 0)
        return;
    

    var neighbs = Pieces.getAdj(Cursor.gridX,Cursor.gridY);
    for (var j =0 ; j< neighbs.length; j++){
                var piece = Pieces.grid[neighbs[j].x][neighbs[j].y];
                if(!piece.stem){
                KGDN.scene.remove(piece.group);
                Pieces.grid[neighbs[j].x][neighbs[j].y] = 0;   
                                    }
                }
        for(var a = Math.max(0, Cursor.gridX - 1); a <= Math.min(Cursor.gridX+1,KGDN.grid[0]-1) ; a++){
        for(var b = Math.max(0, Cursor.gridX - 1); b <=  Math.min(Cursor.gridY+1,KGDN.grid[1]-1); b++){
            if(Pieces.growth[a][b] != undefined)
            KGDN.scene.remove(Pieces.growth[a][b].group);
            Pieces.growth[a][b] = undefined;
}}
        KGDN.trimsLeft--;
    $("#trims").html("" + KGDN.trimsLeft);
    
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
  //  console.log(distance);
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
    KGDN.placeOnGrid(Cursor.group,Cursor.gridX,Cursor.gridY,KGDN.tileGrid.position.z + 2);
    KGDN.placeOnGrid(KGDN.cursLight,Cursor.gridX,Cursor.gridY,KGDN.tileGrid.position.z + 30);
//    console.log(KGDN.cursLight.position.x + " " + KGDN.cursLight.position.y);
    KGDN.camera.position.x = (event.clientX - window.innerWidth/2)/60;
    KGDN.camera.position.y = -(event.clientY - window.innerHeight/2) /60;
};


