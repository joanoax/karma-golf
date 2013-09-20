



function Piece(x,y,text,score,stem,sub){
    this.x = x;
    this.y = y;
    this.text = text;
    this.score = score;
    this.stem = stem;
    this.sub = sub;
    this.falling = true;
    this.isNew = true;
    this.mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(6.6,KGDN.pieceSize,0),
                    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("/img/piece6.png"),
                                                 transparent: true,
                                                 opacity: 1,
                                                // blending: "AdditiveBlending"
                                                }));
   // alert("Making a piece!");
    KGDN.scene.add(this.mesh);
    KGDN.placeOnGrid(this.mesh,this.x,this.y, KGDN.tileGrid.position.z + 2);
};
Piece.prototype.print = function(){
    console.log("X: " + this.x + 
                " Y:" + this.y + 
                " Type:" + this.type +
                " Text:" + this.text.substring(0,50));};


