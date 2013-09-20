Cursor = {};
Cursor.init = function(img_path){
    Cursor.x = 0;
    Cursor.y = 0;
    Cursor.gridX = -9;
    Cursor.gridY = -9;
    Cursor.txt =  THREE.ImageUtils.loadTexture(img_path);
    Cursor.mesh =  new THREE.Mesh(
                    new THREE.PlaneGeometry(KGDN.pieceSize, KGDN.pieceSize,0),
                    new THREE.MeshBasicMaterial({map: Cursor.txt,
                                                 transparent: true,
                                                 opacity: 1,
                                                // blending: "AdditiveBlending"
                                                }));
    Cursor.mesh.position.set(0,0,-150);
    Cursor.mesh.geometry.dynamic = true; 
    window.onmousemove = Cursor.update;

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
    console.log(distance);
    var newVec = KGDN.camera.position.clone().add(dir.multiplyScalar(distance)); 
    newVec.z = KGDN.tileGrid.position.z;
    newVec.x = Math.round(newVec.x /6.6)*6.6;
    newVec.y = Math.round(newVec.y /6.6)*6.6;
    Cursor.mesh.position.set(newVec.x,newVec.y,newVec.z);
    KGDN.camera.position.x = (event.clientX - window.innerWidth/2)/60;
    KGDN.camera.position.y = -(event.clientY - window.innerHeight/2) /60;
};

// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

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
        if(bg == 3){
            bgMaterial = new THREE.MeshLambertMaterial(
            {map: THREE.ImageUtils.loadTexture("/img/space-bg" + bg + ".png"),
             transparent: true,
             opacity: 1
            });}
            else{
                        bgMaterial = new THREE.MeshLambertMaterial(
            {map: THREE.ImageUtils.loadTexture("/img/space-bg" + bg + ".png"),
             transparent: true,
             opacity: 1
            });}
    
       
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
    
    Cursor.init('/img/cursor.png'); 
    KGDN.scene.add(Cursor.mesh);
    //KGDN.draw();
   ///cats. 
  // setInterval(function (){ KGDN.cats.push(new Cat(new THREE.Vector3(_.random(-100,100),_.random(-100,100),-1000), 0, 0))} , 2000);

    //Keyboard handling
    window.addEventListener('keydown',KGDN.keydownHandler, false);
};

KGDN.keydownHandler =  function(event) {
  switch (event.keyCode) {
    case 38: //Up 
      KGDN.camera.position.z += 10;
      break;
    case 40: // Down 
      KGDN.camera.position.z -= 10; break;
  }};

KGDN.draw = function() {

        // draw!
  
//   KGDN.renderer.clear();
  //  KGDN.renderer.render(KGDN.bgScene, KGDN.bgCam);
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
