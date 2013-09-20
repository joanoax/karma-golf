function Piece(x,y,text,score,sub,stem){
    this.x = x;
    this.y = y;
    this.z = -900;
    this.text = text;
    this.score = score;
    this.stem = stem;
    this.sub = sub;
    this.falling = true;
   // alert("Creating");
    var mesh = [];
    this.group = new THREE.Object3D();
    if(this.falling){
            mesh.push( new THREE.Mesh(
            new THREE.PlaneGeometry(6.6,KGDN.pieceSize,0),
            new THREE.MeshLambertMaterial({map: Pieces.fallingTxt,
                                           transparent: true,
                                           opacity: 1, 
                                          })));
         this.group.add(mesh[0]);

        }
    else{
        this.place();
        }
        
    this.id = Pieces.nextID;
    Pieces.nextID++;

    KGDN.placeOnGrid(this.group,x,y,this.z);
        KGDN.scene.add(this.group);
   this.print();
};

Piece.prototype.place = function(){
   // alert("Placed");
    if(this.group != undefined)
        KGDN.scene.remove(this.group);
    this.z = KGDN.tileGrid.position.z; 
    var mesh = [];
    this.group = new THREE.Object3D();
        this.group.position.z = this.z;
    if(this.stem){
        mesh.push( new THREE.Mesh(
            new THREE.PlaneGeometry(6.6,KGDN.pieceSize,0),
            new THREE.MeshLambertMaterial({map: Pieces.stemTxt,
                                           transparent: true,
                                           opacity: 1, 
                                          })));  
        mesh[0].rotation.z = Math.PI/2 * _.random(4);
        mesh[0].position.z = 0.5;
        this.group.add(mesh[0]);
        mesh[1] = new THREE.Mesh(
            new THREE.PlaneGeometry(4,4,0),
            new THREE.MeshLambertMaterial({map: Pieces.flowerTxt[this.sub],
                                           transparent: true,
                                           opacity: 1, 
                                          }));
        mesh[1].position.z = 2.0;
        this.group.add(mesh[1]);
        }
    else{
        mesh.push( new THREE.Mesh(
            new THREE.PlaneGeometry(6.6,KGDN.pieceSize,0),
            new THREE.MeshLambertMaterial({map: Pieces.flowerTxt[this.sub],
                                           transparent: true,
                                           opacity: 1, 
                                          })));  
        mesh[0].rotation.z = Math.PI * Math.random();
        mesh[0].position.z = 5;
        this.group.add(mesh[0]);
        }
    KGDN.placeOnGrid(this.group,this.x,this.y,this.z);
    KGDN.scene.add(this.group);

};

Piece.prototype.move = function(pos){
    for (var i = 0; i < this.mesh.length; i++){
        this.mesh[i].position = pos.clone();
        }
};
Piece.prototype.print = function(){
    console.log("X: " + this.x + 
                " Y:" + this.y + 
                " Type:" + this.type +
                " Text:" + this.text.substring(0,50));};


