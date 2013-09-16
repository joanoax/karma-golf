KGDN = {};
KGDN.fps = 50;
KGDN.bgLayers = [];
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


KGDN.init = function (){
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;

    // set some camera attributes
    var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    var $container = $('#container');

    // create a WebGL renderer, camera
    // and a scene
    KGDN.renderer = new THREE.WebGLRenderer();
    KGDN.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    KGDN.scene = new THREE.Scene();

    // add the KGDN.camera to the scene
    KGDN.scene.add(KGDN.camera);
    // the KGDN.camera starts at 0,0,0 so pull it back
    KGDN.camera.position.z = 0;
    // start the renderer
    KGDN.renderer.setSize(WIDTH, HEIGHT);
    // attach the render-supplied DOM element
    $container.append(KGDN.renderer.domElement);

    
    for(var bg = 2; bg < 5; bg++){
        var bgMaterial = new THREE.MeshLambertMaterial(
            {map: THREE.ImageUtils.loadTexture("/img/space-bg" + bg + ".png"),
             transparent: true,
             opacity: 1
            });
        var scale = 1 - 0.3 * (bg - 2);
        var bgMesh = new THREE.Mesh( new THREE.PlaneGeometry(800 *scale,600* scale), bgMaterial);
        KGDN.scene.add(bgMesh);
        bgMesh.position.z =  150 * bg - 750;
        KGDN.bgLayers.push(bgMesh);
        }
    //KGDN.scene.add(new THREE.AmbientLight(0xcccccc));

    var pl = new THREE.PointLight(0x9995AA,3,1500);
    pl.position.set(-100,0,-100);
    KGDN.scene.add(pl);
    

    var bg = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2, 0),
        new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("/img/space-bg.png")})
    );

// The bg plane shouldn't care about the z-buffer.
    bg.material.depthTest = false;
    bg.material.depthWrite = false;

    KGDN.bgScene = new THREE.Scene();
    KGDN.bgCam = new THREE.Camera();
    KGDN.bgScene.add(KGDN.bgCam);
    KGDN.bgScene.add(bg);

   setInterval(function (){ KGDN.cats.push(new Cat(new THREE.Vector3(_.random(-100,100),_.random(-100,100),-2000), 0, 0))}
                            , 2000);

    window.addEventListener('keydown',KGDN.keydownHandler, false);
};

KGDN.keydownHandler =  function(event) {
  switch (event.keyCode) {
    case 38: //Up 
      KGDN.camera.position.z += 5;
      break;
    case 40: // Down 
      KGDN.camera.position.z -= 5; break;
  }};

KGDN.draw = function() {
        // draw!
    KGDN.renderer.autoClear = false;
    KGDN.renderer.clear();
    KGDN.renderer.render(KGDN.bgScene, KGDN.bgCam);
    KGDN.renderer.render(KGDN.scene, KGDN.camera);
    };

KGDN.handleMouse = function(event){
    KGDN.mouseX = event.clientX;
    KGDN.mouseY = event.clientY;
};

window.onmousemove = KGDN.handleMouse;
    

KGDN.update = function () {
    KGDN.camera.position.x = -50 + KGDN.mouseX/25;
    KGDN.camera.position.y = 50 - KGDN.mouseY/25;
    for(var i =0; i < KGDN.cats.length; i++){
        KGDN.cats[i].update();
        console.log(KGDN.cats[i].mesh.position.z);
        }
 //   if(KGDN.cats.length > 0)
   //     KGDN.moveCats();
    console.log(KGDN.cats.length);
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
    
    KGDN.draw();
  };
})();


$(document).ready(function(){
    // Start the game loop
    KGDN.init();
    KGDN._intervalId = setInterval(KGDN.run, 0);
});
