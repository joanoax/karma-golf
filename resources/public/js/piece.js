function Piece(x,y,text,score){
    this.x = x;
    this.y = y;
    this.text = text;
    this.score = score;
    this.type = "piece";
};

Piece.prototype.draw = function() {
    row = $("table tr")[this.y];
    cell = $(row).children()[this.x];
    piece = $(cell).children();
    $(piece).removeClass("cell");
    $(piece).addClass(this.type);
    };

Piece.prototype.update = function(){
//    console.log("Piece X:" + this.x + "Piece Y" + this.y);
    };

Piece.prototype.moveLeft = function (){
    if(this.x >= 0)
        this.x -=1;
};

Piece.prototype.moveRight = function(){
        if(this.x < Game.gridWidth)
            this.x += 1;
};

Piece.prototype.moveDown = function(){
    this.y += 1;
    var depth = 0;
    for (var i=0; i < Game.entities.length; i++) {
        if(Game.entities[i].x == this.x){
            depth++;
            }
        }
    if(this.y >= Game.gridHeight-depth){
          Game.cPiece = new Piece(_.random(7),0,"Write an ajax function to load text here", 25);
          Game.entities.push(Game.cPiece);
        }
};
