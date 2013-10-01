function Piece(x,y,text,score,sub,stem,falling){
    this.x = x;
    this.y = y;
    this.z = -900;
    this.text = text;
    this.score = score;
    this.stem = stem;
    this.sub = sub;
    this.falling = falling;
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
          KGDN.placeOnGrid(this.group,x,y,this.z);
        KGDN.scene.add(this.group);
        }
    else{
        this.place();
        }
        
    this.id = Pieces.nextID;
    Pieces.nextID++;

  
  this.print();
};
    

Piece.prototype.place = function(){
 

    if(this.group != undefined)
        KGDN.scene.remove(this.group);
    this.z = KGDN.tileGrid.position.z; 
    var mesh = [];
    this.group = new THREE.Object3D();
        this.group.position.z = this.z;
    if(this.stem){
        mesh.push( new THREE.Mesh(
            new THREE.PlaneGeometry(20,KGDN.pieceSize * 3,0),
            new THREE.MeshLambertMaterial({map: Pieces.stemTxt,
                                           transparent: true,
                                           opacity: 0.3, 
                                          })));  
        mesh[0].rotation.z = Math.PI/2 * _.random(4);
        mesh[0].position.z = 0;
        this.group.add(mesh[0]);
        mesh[1] = new THREE.Mesh(
            new THREE.PlaneGeometry(KGDN.pieceSize,KGDN.pieceSize,0),
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
    var thisText = this.score >= 1000 ? Math.floor(this.score/1000) + "k" : this.score;
    var textGeo = new THREE.TextGeometry(thisText,{font: 'gentilis', size:2.6, height: 0.1});
    var textMesh = new THREE.Mesh(textGeo,new THREE.MeshBasicMaterial({color: Pieces.subColors[this.sub] ,
                                                                       transparent: true, opacity: 0.8
                                                                     
                                                                      }));
    textMesh.position.set(-3,0,5);
    this.group.add(textMesh);
    KGDN.placeOnGrid(this.group,this.x,this.y,this.z);
    KGDN.scene.add(this.group);
    Pieces.grid[this.x][this.y] = this;

};

Piece.prototype.move = function(pos){
    for (var i = 0; i < this.mesh.length; i++){
       this.mesh[i].position = pos.clone();
        }
};
Piece.prototype.print = function(){
    console.log("X: " + this.x + 
                " Y:" + this.y + 
                " Subreddit:" + this.sub +
                " Text:" + this.text.substring(0,50) +
                " Score: " + this.score
               );};


