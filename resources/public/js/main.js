

Game = {};

Game.fps = 50;
Game.gridWidth = 8;
Game.gridHeight = 15;
Game.speed = 100;

Game.initialize = function() {
  this.entities = [];
  this.cPiece = new Piece(_.random(7),0,"Write an ajax function to load text here", 25);
  this.entities.push(this.cPiece);
  window.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // Left
      Game.cPiece.moveLeft();
    break;

    case 39: // Right
      Game.cPiece.moveRight();
    break;
  }
}, false);
  window.setInterval(function(){Game.cPiece.moveDown()},Game.speed);
};


Game.draw = function() {
$(".piece").attr('class','cell');
  for (var i=0; i < this.entities.length; i++) {
       this.entities[i].draw();
      }
};

Game.update = function() {
//  if(Key.isDown(Key.LEFT)){ this.cPiece.moveLeft();}
//  if(Key.isDown(Key.RIGHT)){ this.cPiece.moveRight();} 

  for (var i=0; i < this.entities.length; i++) {
    this.entities[i].update();
  }
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



$(document).ready(function(){
    // Start the game loop
    Game.initialize();
    Game._intervalId = setInterval(Game.run, 0);
});







