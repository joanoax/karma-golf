KGDN = {};
KGDN.fps = 60;
KGDN.bgLayers = [];
KGDN.bgZs = [-250,-220,-120];
KGDN.camOffset = [0.0,10.0];
KGDN.velocity = 2;
KGDN.grid = [13,13];
KGDN.score = 00;
KGDN.diff = [0,0];
KGDN.gameRunning = false;
var diff;
KGDN.trimsLeft = 5;
KGDN.yinScore = 100;
KGDN.gridSize = 100;
KGDN.hasParentOnboard = false;
KGDN.parentOnboard = [];
KGDN.pieceSize = KGDN.gridSize/KGDN.grid[0];
KGDN.subreddits = ["AskReddit", "worldnews" ,  "science" ,  "gaming" ,  "WTF" ];

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};



// Rotate an object around an arbitrary axis in object space
var rotObjectMatrix;
function rotateAroundObjectAxis(object, axis, radians) {
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
    // new code for Three.JS r55+:
    object.matrix.multiply(rotObjectMatrix);

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // new code for Three.js r50+:
    object.rotation.setEulerFromRotationMatrix(object.matrix);
}

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
KGDN.animRot = function(startDist,leftDist,dur) {
    // caching the object for performance reasons
    var $elem = $('#yinyang');

    // we use a pseudo object for the animation
    // (starts from `0` to `angle`), you can name it as you want
    $({dist: startDist}).animate({dist: leftDist}, {
        duration: dur ,
        step: function(now) {
            // in the step-callback (that is fired each step of the animation),
            // you can use the `now` paramter which contains the current
            // animation-position (`0` up to `angle`)
            $elem.css({
                left: now + "px",
                transform: 'rotate(' + (now * Math.PI)/40 + 'rad)'
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
    var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 5000;

    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    var $container = $('#container');
        KGDN.animRot(0,360,1000);
    // create a WebGL renderer, camera
    // and a scene
    KGDN.renderer = new THREE.WebGLRenderer({antialiasing: true,
                                             maxLights: 7
                                            });
    KGDN.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  //  KGDN.camera.position.z = 30;
    KGDN.scene = new THREE.Scene();
    
    //Initialize piece data and meshes.
 
       

    
    
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
     
 
     KGDN.draw(); 

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
    Cursor.group.rotateZ(Math.PI/2);
    KGDN.scene.add(Cursor.group);        
 // window.setInterval(function(){Pieces.loadPiece("AskReddit",false)}, 500);
       $(document).mousemove(function(event){KGDN.mouseEv = event;});
    window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
        Cursor.trim();
    return false;
};


    KGDN.gameRunning = true;
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
    if(KGDN.mouseEv != undefined)

    if(KGDN.gameRunning){
            Cursor.update(KGDN.mouseEv);
    KGDN.update();
        }
    KGDN.renderer.render(KGDN.scene, KGDN.camera);
     requestAnimFrame(KGDN.draw);
    };
  
KGDN.update = function () {
    var stem,subreddit,off,bnd,ind;
    KGDN.updateHTML();
        //Load more pieces if the queue is not full.
    if(Pieces.unplacedQueue.length < 10){
        subreddit = Pieces.stems[_.random(Pieces.stems.length-1)].sub;
        Pieces.unplacedQueue.push(Pieces.loadPiece(subreddit,false,8,8,true));
    }
   if(KGDN.hasParentOnboard){
       Cursor.arrow.rotation.z = 0;
       KGDN.diff  = [ Cursor.gridX -  KGDN.parentOnboard[0], Cursor.gridY - KGDN.parentOnboard[1] ];
       Cursor.arrow.rotateZ(Math.atan2(-KGDN.diff[1],KGDN.diff[0]));
   }
  // console.log("Pieces.falling.group.position.z ="  + Pieces.falling.group.position.z);
  

   Pieces.falling.x = Cursor.gridX;
   Pieces.falling.y = Cursor.gridY; 
        Pieces.falling.group.position.z += KGDN.velocity;
   KGDN.placeOnGrid(Pieces.falling.group,Pieces.falling.x, Pieces.falling.y, Pieces.falling.group.position.z);
    
    if(Pieces.falling.group.position.z > KGDN.tileGrid.position.z){
        KGDN.placeFalling();
        }
    if(Pieces.grid[Cursor.gridX][Cursor.gridY]  != 0){
         off = Pieces.neighbs[_.random(Pieces.neighbs.length-1)];
         bnd = function (x, l, u) { return Math.max(l,Math.min(x,u));};
        Cursor.gridX = bnd(Cursor.gridX + off[0], 0, KGDN.grid[0]-1);
        Cursor.gridY = bnd(Cursor.gridY + off[1], 0, KGDN.grid[1]-1);
      //    KGDN.placeOnGrid(Cursor.group,Cursor.gridX,Cursor.gridY,KGDN.tileGrid.position.z + 2);
 //KGDN.placeOnGrid(KGDN.cursLight,Cursor.gridX,Cursor.gridY,KGDN.tileGrid.position.z + 30);
}
    };

KGDN.stop = function(){
    window.clearInterval(KGDN._intervalId);
    $(".game-end").css({display: "block", opacity: 0});
    $(".game-end").animate({ "z-index": 2000, opacity:1}, 2000);
}

KGDN.placeFalling = function(){

    //Remove pieces under it.
    if(Pieces.grid[Pieces.falling.x][Pieces.falling.y] != undefined)
    KGDN.scene.remove( Pieces.grid[Pieces.falling.x][Pieces.falling.y].group);
        if(Pieces.growth[Pieces.falling.x][Pieces.falling.y] != undefined)
    KGDN.scene.remove( Pieces.growth[Pieces.falling.x][Pieces.falling.y].group);


    if(KGDN.hasParentOnboard 
       && Math.abs(KGDN.diff[0]) <= 1 
              && Math.abs(KGDN.diff[1]) <= 1 
){KGDN.trimsLeft += 10;}
        

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
        var points = (3 - KGDN.pieceDist(theStem.x,theStem.y,Pieces.falling.x,Pieces.falling.y));
        points *= 3;
            KGDN.yinScore += points;
        KGDN.score += Pieces.falling.score;
        }
    if(KGDN.yinScore <= 0){
        KGDN.stop();
        }
    KGDN.yinScore = Math.min(Math.max(KGDN.yinScore,0),100);
    KGDN.animRot(yinScoreOld*3.6,KGDN.yinScore*3.6,1000);
 //   $("#points").html((points >= 0 ? "+" : " ") + points + "!");
    $("#score").html("" + KGDN.score);
    $("#trims").html("" + KGDN.trimsLeft);
    Pieces.grow();
        Pieces.falling = Pieces.unplacedQueue.shift();
    while(Pieces.falling.text == "Unrealized")
          Pieces.falling = Pieces.unplacedQueue.shift();
        KGDN.hasParentOnboard = false;
    
    for(var x = 0; x < KGDN.grid[0]; x++){
        for(var y = 0; y < KGDN.grid[1]; y++){
            if(Pieces.falling.parentBody != "" &&
               Pieces.grid[x][y].text === Pieces.falling.parentBody){
                KGDN.hasParentOnboard =true;
                KGDN.parentOnboard = [x,y];
                }}}
    if(KGDN.hasParentOnboard)
        Cursor.arrow.material.opacity = 1;
    else
        Cursor.arrow.material.opacity = 0;
        
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
    $("#convo-bubble > .contents").html(Pieces.falling.text);  
    if(KGDN.hasParentOnboard){
 //       $("#stems").append("<li>" + KGDN.parentOnboard[0] + " "+ KGDN.parentOnboard[1] + "</li>");
  //       $("#stems").append("<li>" + KGDN.diff[0] + " "+ KGDN.diff[1] + "</li>");

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

    $("#start-game").click(function(){
                KGDN.init();    
        $(".loading").fadeOut(3000,function(){

                
      //  KGDN._intervalId = setInterval(KGDN.run, 0);
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
