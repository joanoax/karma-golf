KGDN = {};
KGDN.fps = 50;
KGDN.bgLayers = [];
KGDN.bgZs = [-250,-220,-120];
KGDN.camOffset = [0.0,10.0];
KGDN.velocity = 2;
KGDN.grid = [13,13];
KGDN.score = 0;
KGDN.trimsLeft = 5;
KGDN.yinScore = 0;
KGDN.gridSize = 100;
KGDN.hasParentOnboard = false;
KGDN.pieceSize = KGDN.gridSize/KGDN.grid[0];
KGDN.subreddits = ["AskReddit", "worldnews" ,  "science" ,  "gaming" ,  "WTF" ];

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

KGDN.drawGrid = function(xo,yo,z){
    var tileTxt = THREE.ImageUtils.loadTexture("/img/baseTile.png");
    tileTxt.wrapS = tileTxt.wrapT = THREE.RepeatWrapping;
    tileTxt.repeat.set( KGDN.grid[0], KGDN.grid[1] );
                var tileGrid = new THREE.Mesh(
                    new THREE.PlaneGeometry(KGDN.gridSize,KGDN.gridSize,0),
                    new THREE.MeshBasicMaterial({map: tileTxt,
                                                 transparent: true,
                                                 opacity: 0.15
                                                 ,blending: "AdditiveBlending"
                                                }));
                tileGrid.position.set( xo,yo,z);
                KGDN.scene.add(tileGrid);
    KGDN.tileGrid = tileGrid;
};
KGDN.animRot = function(start,angle) {
    // caching the object for performance reasons
    var $elem = $('#yinyang');

    // we use a pseudo object for the animation
    // (starts from `0` to `angle`), you can name it as you want
    $({deg: start}).animate({deg: angle}, {
        duration: 500,
        step: function(now) {
            // in the step-callback (that is fired each step of the animation),
            // you can use the `now` paramter which contains the current
            // animation-position (`0` up to `angle`)
            $elem.css({
                transform: 'rotate(' + now + 'deg)'
            });
        }
    });
}
KGDN.placeOnGrid = function(mesh,gridX, gridY,z){
        var newX =  gridX * KGDN.pieceSize +  KGDN.tileGrid.position.x - 50 + KGDN.pieceSize/2;
    var newY = - gridY * KGDN.pieceSize + KGDN.tileGrid.position.y + 50 - KGDN.pieceSize/2;
    mesh.position.set(newX,newY,z);
};
KGDN.pieceDist = function( p1x,p1y,p2x,p2y )
{
  var xs = 0;
  var ys = 0;
 
  xs = p2x - p1x;
  xs = xs * xs;
 
  ys = p2y - p1y;
  ys = ys * ys;
 
  return Math.round(Math.sqrt( xs + ys ));
}



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
    KGDN.renderer = new THREE.WebGLRenderer({antialiasing: true,
                                             maxLights: 7
                                            });
    KGDN.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    //KGDN.camera.position.z = 300;
    KGDN.scene = new THREE.Scene();
    
    //Initialize piece data and meshes.
 
            KGDN.draw();

    
    
    // add the camera to the scene
    KGDN.scene.add(KGDN.camera);
    KGDN.renderer.setSize(WIDTH, HEIGHT);
    $container.append(KGDN.renderer.domElement);

    KGDN.bgVecs = [];
    KGDN.bgVecs[0] = new THREE.Vector3(50,0,-267);
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
    
    //cat & yinyang
    var catMat = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('/img/fullofstars.png'),transparent: true, opacity: 1
            });
    var catScale = 7;
    KGDN.cat = new THREE.Mesh(new THREE.PlaneGeometry(5*catScale,4*catScale),catMat);
                                               KGDN.cat.position.set(65,-30,-80);
                                               
                                               
    KGDN.scene.add(KGDN.cat);
     
 
     

    //Game-board
    KGDN.drawGrid(60,0,-150);
       Pieces.init();
        //Static lights.
    KGDN.scene.add(new THREE.AmbientLight(0x353035));
    var pl = new THREE.PointLight(0x886988,3,220);
    pl.position.set(KGDN.tileGrid.position.x ,KGDN.tileGrid.position.y ,-60);
    KGDN.scene.add(pl);
    
    var otherLight = new THREE.PointLight(0x886699,2,500);
    otherLight.position.set(0,0,-300);
    KGDN.scene.add(otherLight);
    KGDN.cursLight = pl;
    Cursor.init('/img/cursor.png'); 

    KGDN.scene.add(Cursor.mesh);        
 // window.setInterval(function(){Pieces.loadPiece("AskReddit",false)}, 500);
        window.onmousemove = Cursor.update;
    window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
        Cursor.trim();
    return false;
};
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
    var stem,subreddit;
    KGDN.updateHTML();
    //Load more pieces if the queue is not full.
    if(Pieces.unplacedQueue.length < 10){
        stem = false;
        subreddit = Pieces.stems[_.random(Pieces.stems.length-1)].sub;
        Pieces.unplacedQueue.push(Pieces.loadPiece(subreddit,stem));
    }
 

   Pieces.falling.x = Cursor.gridX;
   Pieces.falling.y = Cursor.gridY; 
        Pieces.falling.group.position.z += KGDN.velocity;
   KGDN.placeOnGrid(Pieces.falling.group,Pieces.falling.x, Pieces.falling.y, Pieces.falling.group.position.z);
    
    if(Pieces.falling.group.position.z > KGDN.tileGrid.position.z){
        KGDN.placeFalling();
        }
    };

KGDN.placeFalling = function(){

    //Remove pieces under it.
    if(Pieces.grid[Pieces.falling.x][Pieces.falling.y] != undefined)
    KGDN.scene.remove( Pieces.grid[Pieces.falling.x][Pieces.falling.y].group);
        if(Pieces.growth[Pieces.falling.x][Pieces.falling.y] != undefined)
    KGDN.scene.remove( Pieces.growth[Pieces.falling.x][Pieces.falling.y].group);
    KGDN.hasParentOnboard = false;
                for(var x = 0; x < KGDN.grid[0]; x++){
        for(var y = 0; y < KGDN.grid[1]; y++){
            if(Pieces.falling.parentBody != "" &&
               Pieces.grid[x][y].text === Pieces.falling.parentBody){
                KGDN.hasParentOnboard =true;
                }}}

      Pieces.grid[Pieces.falling.x][Pieces.falling.y] = Pieces.falling;
            Pieces.falling.place();

        //Calculate score.
    var theStem;
    var yinScoreOld = KGDN.yinScore;
    for(var i in Pieces.stems){
        var theStem = Pieces.stems[i].sub === Pieces.falling.sub ? Pieces.stems[i] : theStem;
        }

    for(var i in Pieces.stems){
        var around = Pieces.getNeighbors(Pieces.stems[i].x,Pieces.stems[i].y);
        console.log(KGDN.subreddits[i] + " " + around.length);
        if(around.length >= 8){
            var connected = Pieces.getConnected(Pieces.stems[i].x,Pieces.stems[i].y);
            for (var j = 0; j < connected.length; j++){
                var piece = Pieces.grid[connected[j][0]][connected[j][1]];
                if(!piece.stem){
                KGDN.scene.remove(Pieces.grid[connected[j][0]][connected[j][1]].group);
                Pieces.grid[connected[j][0]][connected[j][1]] = 0;
                    
                    }
                }
            }
        }
    
    if(theStem){
        var points = Math.pow( 5 -   KGDN.pieceDist(theStem.x,theStem.y,Pieces.falling.x,Pieces.falling.y) , 2);
        points *= 5;
        if ( 6  -  KGDN.pieceDist(theStem.x,theStem.y,Pieces.falling.x,Pieces.falling.y) < 0){
            points *= -1;
            KGDN.yinScore += points/5;
            }
        else{
            KGDN.yinScore += points/5;
            }
        KGDN.score += points;
        }
    KGDN.yinScore = Math.min(Math.max(KGDN.yinScore,-90),90)
    KGDN.animRot(yinScoreOld,KGDN.yinScore);
    $("#points").html((points >= 0 ? "+" : " ") + points + "!");
    $("#score").html("" + KGDN.score);
    $("#trims").html("" + KGDN.trimsLeft);
    Pieces.grow();
        Pieces.falling = Pieces.unplacedQueue.shift();
};

KGDN.updateHTML = function(){
        //Update stem text.
    $("#stems").html("");
    for(var i = 0 ; i < Pieces.stems.length; i++){
        var row = "<li> <div class ='show-piece piece" + i  + "' ></div>";
        row += " " + Pieces.stems[i].sub.capitalize();
      //  row += " * " + Pieces.getNeighbors(Pieces.stems[i].x,Pieces.stems[i].y).length + "/8";
        row += " * " + Pieces.stems[i].text;
  
        row += "</li>";
        $("#stems").append(row);
    }
    $("#convo-bubble > .contents").html(Pieces.falling.text +( KGDN.hasParentOnboard ? "*" : " " ) );  
    
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

    $("#start-game").click(function(){
                KGDN.init();    
        $(".loading").fadeOut(3000,function(){


        KGDN._intervalId = setInterval(KGDN.run, 0);
            $(document).keydown(function(event){
                if(event.which == 32){
                    Cursor.trim();
                    }
                });
               $(document).mousedown( function(event){
        var isStem = Math.floor(Math.random() + 0.5) == 1;
        KGDN.placeFalling();
      //  Pieces.grow();
        for(var i = 0; i < Pieces.stems.length; i++){
            var bs = Pieces.getConnected(Pieces.stems[i].x,Pieces.stems[i].y).length;
          //  console.log(Pieces.stems[i].x + "x " + Pieces.stems[i].y + "y " + bs);
        }
      //  console.log("Loading");
                    
        });
        });});
});
