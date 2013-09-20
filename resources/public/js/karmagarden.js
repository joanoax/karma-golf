KGDN = {};
KGDN.fps = 50;
KGDN.bgLayers = [];
KGDN.bgZs = [-250,-180,-120];
KGDN.camOffset = [0.0,10.0];
KGDN.grid = [15, 15];
KGDN.pieceSize = 6.6;

KGDN.cats = [];
KGDN.moveCats = function(){
    var scalar = ( KGDN.cats[0].mesh.position.z / Cat.velocity);
    KGDN.cats[0].mesh.position.x += -(KGDN.cats[0].mesh.position.x) / scalar;
    KGDN.cats[0].mesh.position.y += -(KGDN.cats[0].mesh.position.y) / scalar;
    for(var i = 1; i < KGDN.cats.length; i++){
            KGDN.cats[i].mesh.position.x += -(KGDN.cats[i].mesh.position.x) / scalar;
        KGDN.cats[i].mesh.position.y += -(KGDN.cats[i].mesh.position.y) / scalar;
        }
};

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

    var bgMaterial;
    //Set up bg parallax layers.
    for(var bg = 1; bg <= 3; bg++){
        bgMaterial = new THREE.MeshLambertMaterial(
            {map: THREE.ImageUtils.loadTexture("/img/space-bg" + bg + ".png"),
             transparent: true,
             opacity: 1
            });
        var bgMesh = new THREE.Mesh( new THREE.PlaneGeometry(400 - 100 * (bg -1) , 200 - 50 * (bg-1)), bgMaterial);
        bgMesh.position.set(0,0,0);
        KGDN.scene.add(bgMesh);
        bgMesh.position.z =  KGDN.bgZs[bg-1];
        KGDN.bgLayers.push(bgMesh);
        }
    
    //Static lights.
    KGDN.scene.add(new THREE.AmbientLight(0x252222));
   var pl = new THREE.PointLight(0x9995AA,5,300);
    pl.position.set(-100,0,-150);
    KGDN.scene.add(pl);

    //Game-board
    KGDN.drawGrid(40,0,-150);
    
    window.onmousedown = function(event){
        var piece = new Piece(Cursor.gridX,Cursor.gridY,"hi",25,"WTF",false);
        };
    Cursor.init('/img/cursor.png'); 
    KGDN.scene.add(Cursor.mesh);

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
