KGDN = {};
KGDN.fps = 50;
KGDN.bgLayers = [];
KGDN.bgZs = [-250,-220,-120];
KGDN.camOffset = [0.0,10.0];
KGDN.velocity = 3;
KGDN.grid = [15, 15];
KGDN.pieceSize = 6.6;
KGDN.subreddits = ["AskReddit", "worldnews" ,  "science" ,  "gaming" ,  "WTF" ];

KGDN.drawGrid = function(xo,yo,z){
    var tileTxt = THREE.ImageUtils.loadTexture("/img/baseTile.png");
    tileTxt.wrapS = tileTxt.wrapT = THREE.RepeatWrapping;
    tileTxt.repeat.set( KGDN.grid[0], KGDN.grid[1] );
                var tileGrid = new THREE.Mesh(
                    new THREE.PlaneGeometry(100,100,0),
                    new THREE.MeshBasicMaterial({map: tileTxt,
                                                 transparent: true,
                                                 opacity: 0.15
                                                 ,blending: "AdditiveBlending"
                                                }));
                tileGrid.position.set( xo,yo,z);
                KGDN.scene.add(tileGrid);
    KGDN.tileGrid = tileGrid;
};

KGDN.placeOnGrid = function(mesh,gridX, gridY,z){
        var newX =   Cursor.gridX * KGDN.pieceSize +  KGDN.tileGrid.position.x - 50 + KGDN.pieceSize/2;
    var newY = - Cursor.gridY * KGDN.pieceSize + KGDN.tileGrid.position.y + 50 - KGDN.pieceSize/2;
    mesh.position.set(newX,newY,z);
};


KGDN.init = function (){
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;
    KGDN.projector = new THREE.Projector();

    // set some camera attributes
    var VIEW_ANGLE = 40,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 5000;

    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    var $container = $('#container');

    // create a WebGL renderer, camera
    // and a scene
    KGDN.renderer = new THREE.WebGLRenderer();
    KGDN.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    //KGDN.camera.position.z = 300;
    KGDN.scene = new THREE.Scene();
    
    // add the camera to the scene
    KGDN.scene.add(KGDN.camera);
    KGDN.renderer.setSize(WIDTH, HEIGHT);
    $container.append(KGDN.renderer.domElement);

    KGDN.bgVecs = [];
    KGDN.bgVecs[0] = new THREE.Vector3(50,0,-250);
    KGDN.bgVecs[1] = new THREE.Vector3(-20,0,-150);
    KGDN.bgVecs[2] = new THREE.Vector3(0,0,-100);
    

    var bgMaterial;
    //Set up bg parallax layers.
    for(var bg = 1; bg <= 3; bg++){
        bgMaterial = new THREE.MeshLambertMaterial(
            {map: THREE.ImageUtils.loadTexture("/img/space-bg" + bg + ".png"),
             transparent: true,
             opacity: 1
            });
        var bgMesh = new THREE.Mesh( new THREE.PlaneGeometry(400 - 100 * (bg -1) , 200 - 50 * (bg-1)), bgMaterial);
        bgMesh.position = KGDN.bgVecs[bg-1];
        KGDN.scene.add(bgMesh);
        //bgMesh.position.z =  KGDN.bgZs[bg-1];
        KGDN.bgLayers.push(bgMesh);
        }
    

 


    //Game-board
    KGDN.drawGrid(40,0,-150);

        //Static lights.
    KGDN.scene.add(new THREE.AmbientLight(0x999999));
    var pl = new THREE.PointLight(0x88AA99,2,100);
    pl.position.set(KGDN.tileGrid.position.x ,KGDN.tileGrid.position.y ,-120);
       KGDN.scene.add(pl);
    KGDN.cursLight = pl;
    
    window.onmousedown = function(event){
        var isStem = Math.floor(Math.random() + 0.5) == 1;
        Pieces.falling.place();
        Pieces.falling  = new Piece(Cursor.gridX,
                              Cursor.gridY,
                              "hi",
                              25,
                              KGDN.subreddits[_.random(KGDN.subreddits.length-1)],
                                              isStem);
        };
    Cursor.init('/img/cursor.png'); 
    Pieces.init();
    KGDN.scene.add(Cursor.mesh);

 // window.setInterval(function(){Pieces.loadPiece("AskReddit",false)}, 500);

};

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
KGDN.draw = function() {
    requestAnimFrame(KGDN.draw);
    KGDN.renderer.render(KGDN.scene, KGDN.camera);
    };
  
KGDN.update = function () {
    if(Pieces.unplacedQueue.length < 5)
        Pieces.loadPiece(KGDN.subreddits[_.random(KGDN.subreddits.length+1)],false);

   Pieces.falling.x = Cursor.gridX;
   Pieces.falling.y = Cursor.gridY; 
   Pieces.falling.group.position.z += KGDN.velocity;
   KGDN.placeOnGrid(Pieces.falling.group,Pieces.falling.x, Pieces.falling.y, Pieces.falling.group.position.z);
    
    if(Pieces.falling.group.position.z > KGDN.tileGrid.position.z){
        Pieces.falling.place();
        Pieces.falling = Pieces.unplacedQueue.shift();
        }
    };


KGDN.run = (function() {
  var loops = 0, skipTicks = 1000 / KGDN.fps,
      maxFrameSkip = 10,
      nextKGDNTick = (new Date).getTime();
  
  return function() {
    loops = 0;
    
    while ((new Date).getTime() > nextKGDNTick && loops < maxFrameSkip) {
      KGDN.update();
      nextKGDNTick += skipTicks;
      loops++;
    }
    
  //  KGDN.draw();
  };
})();


$(document).ready(function(){
    // Start the game loop
    KGDN.init();
    KGDN.draw();
    KGDN._intervalId = setInterval(KGDN.run, 0);
});
