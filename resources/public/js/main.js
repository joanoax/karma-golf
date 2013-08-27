

Game = {};

Game.fps = 50;
Game.gridWidth = 8;
Game.gridHeight = 15;
Game.dummyText = "..............";
Game.score = 0;
Game.speed = 500;

///Behaviors 
Game.loadPiece = function(){
    console.log("Loading");
    $.getJSON("/piece/", 
              function(data){ 
                  Game.nextPiece = new Piece(_.random(Game.gridWidth-1),0,data["body-html"], data["ups"], data["type"]);});
};

Game.remove = function(pieces){
    for(var p in pieces){
        $(Piece.getCell(pieces[p])).html("");
            Game.entities = _.filter(Game.entities,function(piece){return piece.x != pieces[p].x || piece.y != pieces[p].y;});
            }
};

Game.pieceAt = function(pcx,pcy){
    return _.filter(Game.entities,function(p){p.x == pcx && p.y == pcy}).length > 0;
};

Game.place = function()  {
    Game.cPiece.falling = false;
    if(Game.cPiece.y < 1)
        Game.complete();

    var connected = Game.cPiece.getAllConnected();
    if(connected.length >=  5)
        Game.remove(connected);

    Game.growAll();
    $(Piece.getCell(Game.cPiece)).html(Game.cPiece.score);
    Game.cPiece = Game.nextPiece;
    Game.entities.push(Game.cPiece);
    Game.bgShift(Game.cPiece.x);
    Game.updateComments();
    Game.loadPiece();
}

Game.growAll = function(){
        for (var i=0; i < Game.entities.length; i++) {
            var curr = Game.entities[i];
            if(!curr.isNew)
                curr.grow();
        }
        for (var i=0; i < Game.entities.length; i++) {
            Game.entities[i].isNew = false;
        }
        Game.cPiece.isNew = true;
};

Game.update = function() {
  for (var i=0; i < this.entities.length; i++) {
    this.entities[i].update();
  }
};

///Graphics/View

Game.bgShift = function(col){
    for(var ix = 1; ix <= 7; ix++){
        var paral = (Game.gridWidth - col) * ix  - 40;
        $(".bg" + ix).animate({left: paral+ "px"},150, "linear");
    }};

Game.updateComments = function(){
    $("#convo-top .contents").html(Game.cPiece.text);
    $("#convo-bottom .contents").html(Piece.getTop(Game.cPiece.x).text);};

Game.draw = function() {
$(".piece").attr('class','cell');
  for (var i=0; i < this.entities.length; i++) {
       this.entities[i].draw();}};

///Game logic 

Game.keydownHandler =  function(event) {
  switch (event.keyCode) {
    case 37: // Left
      Game.cPiece.moveLeft(); break;
    case 39: // Right
      Game.cPiece.moveRight();  break;
    case 40: // Down 
      Game.cPiece.drop();  break;
  }};

Game.initialize = function() {
  this.entities = [];
  Game.loadPiece();
  this.cPiece = new Piece(_.random(Game.gridWidth-1),0,Game.dummyText, 25,"spades");
  this.entities.push(this.cPiece);
  Game.updateComments();
  window.addEventListener('keydown',Game.keydownHandler, false);
  Game._pieceIntervalID = window.setInterval(function(){Game.cPiece.moveDown()},Game.speed);
};

Game.run = (function() {
  var loops = 0, skipTicks = 1000 / Game.fps,
      maxFrameSkip = 10,
      nextGameTick = (new Date).getTime();
  
  return function() {
    loops = 0;
    
    while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
      Game.update();
      nextGameTick += skipTicks;
      loops++;
    }
    
    Game.draw();
  };
})();

Game.complete = function(){
    clearInterval(Game._intervalId);
    
    };


$(document).ready(function(){
    // Start the game loop

    Game.initialize();
    Game._intervalId = setInterval(Game.run, 0);
});







