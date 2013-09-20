Cursor = {};
Cursor.init = function(img_path){
    Cursor.x = 0;
    Cursor.y = 0;
    Cursor.gridX = -9;
    Cursor.gridY = -9;
    Cursor.txt =  THREE.ImageUtils.loadTexture(img_path);
    Cursor.mesh =  new THREE.Mesh(
                    new THREE.PlaneGeometry(20,20,0),
                    new THREE.MeshBasicMaterial({map: Cursor.txt,
                                                 transparent: true,
                                                 opacity: 1,
                                                // blending: "AdditiveBlending"
                                                }));
    Cursor.mesh.position.set(0,0,-375);
    Cursor.mesh.geometry.dynamic = true; 
  window.addEventListener('mouseMove', Cursor.update);

};

var curscount = 0;
Cursor.update = function(event){
                KGDN.camera.position.x = -50 + event.clientX/12;
    KGDN.camera.position.y = 50 - event.clientY/12;

    //console.log(curscount);
    Cursor.x = event.clientX;
    Cursor.y = event.clientY;

};


KGDN = {};
KGDN.fps = 50;
KGDN.bgLayers = [];
KGDN.bgZs = [-600,-450,-300];
KGDN.grid = [15, 15];

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
    KGDN.projector = new THREE.Projector();

    // set some camera attributes
    var VIEW_ANGLE = 40,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 1000;

    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    var $container = $('#container');

    // create a WebGL renderer, camera
    // and a scene
    KGDN.renderer = new THREE.WebGLRenderer();
    KGDN.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    KGDN.scene = new THREE.Scene();

    KGDN.camera.position.x = 20;
    KGDN.camera.position.z = 40;
    // add the KGDN.camera to the scene
    KGDN.scene.add(KGDN.camera);
    KGDN.renderer.setSize(WIDTH, HEIGHT);
    $container.append(KGDN.renderer.domElement);



    //Setup up fullscreen bg image.
    KGDN.bgScene = new THREE.Scene();
    KGDN.bgCam = new THREE.Camera();

    var bg = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("/img/space-bg.jpg")})
    );
    bg.material.depthTest = false;
    bg.material.depthWrite = false;
        KGDN.bgScene.add(KGDN.bgCam);
    KGDN.bgScene.add(bg);
    var bgMaterial;
    //Set up bg parallax layers.
    for(var bg = 1; bg <= 3; bg++){
        if(bg == 3){
                 bgMaterial = new THREE.MeshBasicMaterial(
            {map: THREE.ImageUtils.loadTexture("/img/space-bg" + bg + ".png"),
             transparent: true,
             opacity: 1
            });}
            else{
                        bgMaterial = new THREE.MeshBasicMaterial(
            {map: THREE.ImageUtils.loadTexture("/img/space-bg" + bg + ".png"),
             transparent: true,
             opacity: 1
            });}
    
        var scale = 1 - 0.3 * (bg - 2);
        var bgMesh = new THREE.Mesh( new THREE.PlaneGeometry(800 *scale,600* scale,0), bgMaterial);
        KGDN.scene.add(bgMesh);
        bgMesh.position.z =  KGDN.bgZs[bg-1];
        KGDN.bgLayers.push(bgMesh);
        }
    
    //Static lights.
    KGDN.scene.add(new THREE.AmbientLight(0x252222));
    var pl = new THREE.PointLight(0x9995AA,5,150);
    pl.position.set(-100,0,-350);
    KGDN.scene.add(pl);

    //Game-board
    KGDN.drawGrid(40,40,-375);
    
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
      KGDN.camera.position.z += 5;
      break;
    case 40: // Down 
      KGDN.camera.position.z -= 5; break;
  }};

KGDN.draw = function() {
      vector = new THREE.Vector3(
        ( Cursor.x / window.innerWidth ) * 2 - 1,
          -  ( Cursor.y / window.innerHeight ) * 2 + 1,
        0.5 );
    KGDN.projector.unprojectVector(vector, KGDN.camera);
    dir = vector.sub(KGDN.camera.position).normalize();
    ray = new THREE.Raycaster(KGDN.camera.position, dir );
    distance =  KGDN.tileGrid.position.z - KGDN.camera.position.z;
    //console.log(vector + " " + dir + " " + ray + " " + distance);
    newVec = KGDN.camera.position.clone().add(dir.multiplyScalar(distance)); 
    newVec.z = KGDN.tileGrid.position.z;
       newVec.x = Math.round(newVec.x/20)*20;
    newVec.y = Math.round(newVec.y/20)*20;
    console.log(newVec.x + " " + newVec.y + " " + newVec.z);
    Cursor.mesh.position.z = newVec.z;

        // draw!
   KGDN.renderer.autoClear = false;
   KGDN.renderer.clear();
    KGDN.renderer.render(KGDN.bgScene, KGDN.bgCam);
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
    
    KGDN.draw();
  };
})();


$(document).ready(function(){
    // Start the game loop
    KGDN.init();
    KGDN._intervalId = setInterval(KGDN.run, 0);
});
