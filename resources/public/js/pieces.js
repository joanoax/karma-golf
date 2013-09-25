Pieces = {};
Pieces.nextID = 0;
Pieces.nextReq = 0;

Pieces.unplacedQueue = [];
Pieces.stems = [];
Pieces.flowers = [];
Pieces.grid = [];
    Pieces.flowerTxt = {};
    Pieces.subColors = {};
Pieces.init = function(){
    Pieces.stemTxt = THREE.ImageUtils.loadTexture("/img/stems.png");
    Pieces.fallingTxt = THREE.ImageUtils.loadTexture("/img/drop.gif");
            var col = new THREE.Color(); 
    for(var i = 0; i < KGDN.subreddits.length; i++){
        Pieces.flowerTxt[KGDN.subreddits[i]] = THREE.ImageUtils.loadTexture("/img/piece" + i + ".png");
           col = new THREE.Color(); 
        Pieces.subColors[KGDN.subreddits[i]] = col.setHSL(0.2*i,0.6,1);
        }

    //Build grid for placed pieces.
    for(var x = 0; x < KGDN.grid[0]; x++){
        Pieces.grid[x] = [];
        for(var y = 0; y < KGDN.grid[1]; y++){
            Pieces.grid[x][y] = 0;
            }}

    Pieces.falling = new Piece(Cursor.gridX,
                              Cursor.gridY,
                              "hi",
                              25,
                              KGDN.subreddits[_.random(KGDN.subreddits.length-1)],
                                              false,true);
    };


Pieces.getFlowersAt = function (grX,grY){
    return _.filter(Pieces.flowers, function(p){ return p.x == grX && p.y == grY});
};

Pieces.growByAdjCount = function(x,y,subreddit,adjThreshold){
    var neighborCount = 0;
    var neighbors = [];
    for(var a = Math.max(0, x - 1); a <= Math.min(x+1,KGDN.grid[0]-1) ; a++){
        for(var b = Math.max(0, y - 1); b <=  Math.min(y+1,KGDN.grid[1]-1); b++){
            if(!(a == 0 && b == 0) 
               && Pieces.grid[a][b] != 0 
               && Pieces.grid[a][b].sub === subreddit 
               && !Pieces.grid[a][b].stem 
               && Pieces.grid[a][b].score > 4 
              ){
                neighborCount++;
                neighbors.push(Pieces.grid[a][b]);
            }
        }
        }
    if(neighborCount >= adjThreshold){
        var newScore = 0;
        for(var nI = 0; nI < neighbors.length; nI++){
            neighbors[nI].score =Math.floor( neighbors[nI].score /2);
            newScore += neighbors[nI].score/2; //Total == 1/4 of
            //original piece's score added.
            }
        Pieces.grid[x][y] = new Piece(x,y,"Growth",newScore,subreddit,false,false);
        }
    return neighborCount;
};


Pieces.makeGrid = function(){
    var gridRet = [];
    for(var gX = 0; gX < KGDN.grid[0]; gX++){
        gridRet[gX] = [];
        for(var gY = 0; gY < KGDN.grid[1]; gY++){
            gridRet[gX][gY] = Pieces.getFlowersAt(gX,gY);
            }
    }
    return gridRet;
};

Pieces.grow = function(){
 //   var grid = Pieces.makeGrid();
    for (var x = 0; x <  KGDN.grid[1]; x++){
        var neiStr = " "; 
        for(var y = 0; y < KGDN.grid[0]; y++){
            for(var i = 0; i < KGDN.subreddits.length; i++){
                   if(Pieces.grid[x][y] == 0){
                       neiStr += " " +  Pieces.growByAdjCount(x,y,KGDN.subreddits[i],3);
                       }
            }
            }
    //   console.log(neiStr);
        }
};
    
            


Pieces.loadPiece = function(subreddit,stem){
    var urlBase = stem ? "stem" : "flower";
    var req = Pieces.nextReq++;
    console.log("Loading " + urlBase + " - " + subreddit + " " + req);
    var unrealizedPiece = new Piece(_.random(KGDN.grid[0]-1),
                            _.random(KGDN.grid[1]-1),
                            "Unrealized", 
                            -10 ,
                           subreddit,
                            stem,true);
    $.getJSON(urlBase + "/" +  subreddit + "/" + req, 
              function(data){
                  console.log("Receiving" + urlBase + " - " + subreddit + " " + req);
                  unrealizedPiece.text = data["text"];
                  unrealizedPiece.score = data["ups"] - data["downs"];
  
                                           });
    return unrealizedPiece;
};
