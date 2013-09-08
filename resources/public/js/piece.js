function Piece(x,y,text,score,type){
    this.x = x;
    this.y = y;
    this.text = text;
    this.score = score;
    this.type = type;
    this.falling = true;
    this.isNew = true;
};
Piece.prototype.print = function(){
    console.log("X: " + this.x + 
                " Y:" + this.y + 
                " Type:" + this.type +
                " Text:" + this.text.substring(0,50));};

Piece.sides = [[-1,0],[1,0],[0,-1],[0,1]];
Piece.types = ["hearts","diamonds","spades","clubs"];
///////////////////////

Piece.getCell = function(p){
    row = $("table tr")[p.y];
    cell = $(row).children()[p.x];
    piece = $(cell).children();
    return piece;
};



/////////////////////
Piece.prototype.isAdjacent = function(toPiece){
    return Math.abs(toPiece.x-this.x) + Math.abs(toPiece.y-this.y) == 1;
};

Piece.prototype.getTop = function(){
    var top = new Piece(0,15,"",0,0,0);
    for (var i=0; i < Game.entities.length; i++) {
        var curr = Game.entities[i];
        if(!curr.falling && curr.x == this.x  && curr.y < top.y && curr.y > this.y){
            top = Game.entities[i];}}
    return top;
}

Piece.prototype.getAllConnected = function(){
    var curtype = this.type;
    var thePiece = this;
    var these  = _.filter(Game.entities,
                          function(piece){return piece.type === curtype;});
    var que  = _.filter(these,function(piece){ return thePiece.isAdjacent(piece);});
    var allconnected = [thePiece];
    var count = 0;
    while(que.length > 0 && count < 100){
        count++;
        thePiece = que.shift();
        if (_.filter(allconnected, function(p){return thePiece.x == p.x && thePiece.y === p.y;}).length === 0){
            allconnected.push(thePiece);
            que = que.concat(_.filter(these,function(piece){ return thePiece.isAdjacent(piece);}));
            }               
      }
    return allconnected;
};
        
        
   
Piece.prototype.getAdjacent = function(){
    var adj = [];
    for (var i=0; i < Game.entities.length; i++) {
        var curr = Game.entities[i];
        if(curr.isAdjacent(this))
            adj.push(curr);
        }
    return adj;
};


Piece.prototype.grow = function(){
    console.log("grow!");
    var adjct = this.getAdjacent();
    var newScore = Math.round(this.score/(5-adjct.length));
    if(this.score > 4 && adjct.length < 4 && this.falling == false){
        for(var s in Piece.sides){
            var coords = [this.x + Piece.sides[s][0], this.y + Piece.sides[s][1]];
            console.log("Piece " + coords[0] + " " + coords[1]);
            if(coords[0] >= 0 && coords[0] < Game.gridWidth && coords[1] < Game.gridHeight && !Game.pieceAt(coords[0],coords[1])){
               
            var nextPiece = new Piece(coords[0], coords[1], this.text, newScore, this.type);
            nextPiece.falling = false;
            $(Piece.getCell(nextPiece)).html(nextPiece.score);
            Game.entities.push(nextPiece);
                }
        }
        this.score = newScore;
        $(Piece.getCell(this)).html(this.score);
    }
};

        
/////////////////////
    
Piece.prototype.draw = function() {
    piece = Piece.getCell(this);
    $(piece).removeClass("cell");
    $(piece).removeClass("highlight");
    $(piece).addClass("piece");
    if(this.falling)
        $(piece).addClass("drop");
    else
        $(piece).addClass(this.type);
    if(this.score > 4 && !this.falling)
        $(piece).addClass("highlight");
    };


Piece.prototype.update = function(){
//    console.log("Piece X:" + this.x + "Piece Y" + this.y);
    };


Piece.prototype.moveLeft = function (){
    if(this.x >= 1  && !Game.pieceAt(this.x-1,this.y)){
        this.x -=1;
    Game.bgShift(this.x);
        }
        if(Game.pieceAt(this.x,this.y+1) || this.y >= Game.gridHeight-1 ){
        Game.place();
        }
    Game.updateComments();
};


Piece.prototype.moveRight = function(){
    if(this.x < Game.gridWidth - 1 && !Game.pieceAt(this.x+1,this.y)){
        this.x += 1;
        Game.bgShift(this.x);}
        if(Game.pieceAt(this.x,this.y+1) || this.y >= Game.gridHeight-1 ){
        Game.place();
        }  
    Game.updateComments();
};

Piece.prototype.drop = function(){
    this.y = this.getTop().y - 1;
    Game.place();
};
Piece.prototype.moveDown = function(){
    
    if(Game.pieceAt(this.x,this.y+1) || this.y >= Game.gridHeight - 1){
        Game.place();
        }
    else{
            this.y += 1;
        }

};

