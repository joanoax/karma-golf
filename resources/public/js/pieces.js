Pieces = {};
Pieces.nextID = 0;
Pieces.nextReq = 0;

Pieces.unplacedQueue = [];
Pieces.stems = [];
Pieces.stemLocs = [[6,6],[2,2],[10,2],[2,10],[10,10]];
Pieces.neighbs = [[-1,0],[1,0],[0,-1],[0,1]];
Pieces.growthParams = {"AskReddit":  [400,0.1],
                        "worldnews" : [100,0.05],
                          "science": [5,0.005],
                         "gaming":  [10,0.01],
                         "WTF":  [50,0.02]};
Pieces.flowers = [];
Pieces.grid = [];
Pieces.growth = [];
    Pieces.flowerTxt = {};
    Pieces.subColors = {};
Pieces.init = function(){
    Pieces.stemTxt = THREE.ImageUtils.loadTexture("/img/stems-new.png");
    Pieces.stemTxt.wrapS = Pieces.stemTxt.wrapT = THREE.RepeatWrapping;
    Pieces.stemTxt.repeat.set(3,3);
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
        Pieces.growth[x] = [];
        for(var y = 0; y < KGDN.grid[1]; y++){
            Pieces.grid[x][y] = 0;
            Pieces.growth[x][y] = undefined; 
            }}

    //Load stems.
 //   $.ajaxSetup( { "async": false } );
    var px,py;
    for (var i= 0; i < KGDN.subreddits.length; i++){
          
        px = Pieces.stemLocs[i][0];
        py = Pieces.stemLocs[i][1];
        Pieces.grid[px][py] = Pieces.loadPiece(KGDN.subreddits[i],true,px,py,false);
        Pieces.stems.push(Pieces.grid[px][py]);
        }
    
        $.ajaxSetup( { "async": true } );
          var  subreddit = Pieces.stems[_.random(Pieces.stems.length-1)].sub;
    Pieces.falling = Pieces.loadPiece(subreddit,false,8,8,true);;
    };


Pieces.getFlowersAt = function (grX,grY){
    return _.filter(Pieces.flowers, function(p){ return p.x == grX && p.y == grY});
};

Pieces.areStemsRealized = function(){
    var stemsRealized = true;
    for (var i = 0; i < Pieces.stems.length; i++){
        stemsRealized = stemsRealized && Pieces.stems[i].text === "Unrealized";
        }
    return stemsRealized;
};

Pieces.getNeighbors = function(x,y) {
    var neighborCount = 0;
    var neighbors = [];
    for(var a = Math.max(0, x - 1); a <= Math.min(x+1,KGDN.grid[0]-1) ; a++){
        for(var b = Math.max(0, y - 1); b <=  Math.min(y+1,KGDN.grid[1]-1); b++){
            if(!(a == x && b == y) 
               && Pieces.grid[a][b] != 0 
               && Pieces.grid[a][b].sub === Pieces.grid[x][y].sub
              ){
                neighborCount++;
                neighbors.push(Pieces.grid[a][b]);
            }
        }
        }

    return neighbors;
};

Pieces.getAdj = function(x,y) {
    var neighborCount = 0;
    var neighbors = [];
    for(var a = Math.max(0, x - 1); a <= Math.min(x+1,KGDN.grid[0]-1) ; a++){
        for(var b = Math.max(0, y - 1); b <=  Math.min(y+1,KGDN.grid[1]-1); b++){
            if(!(a == x && b == y) 
               && Pieces.grid[a][b] != 0 
              ){
                neighborCount++;
                neighbors.push(Pieces.grid[a][b]);
            }
        }
        }
    return neighbors;
};

Pieces.getConnected = function(x,y){
    var visitQueue = [[x,y]];
    var visited = [];
    var nPiece,neighbors,filtered;
    while(visitQueue.length > 0){
        var pos = visitQueue.shift();
        if(_.find(visited,function(p){return p[0] === pos[0] && p[1] === pos[1];}) 
           === undefined){
            nPiece = Pieces.grid[pos[0]][pos[1]];
            neighbors = Pieces.getNeighbors(pos[0],pos[1]);

            for (var i = 0; i < neighbors.length; i++){
                visitQueue.push([neighbors[i].x, neighbors[i].y]);
                }
            visited.push(pos);
               }
        }
    return visited;
};
    

Pieces.inGrid = function(x,y){
    return x > 0 && x  < KGDN.grid[0] &&
         y  > 0 && y < KGDN.grid[1];
};

Pieces.growByAdjCount = function(x,y,scoreThreshold,growthRate){
    var grows = false;
  
        for(var i=0; i < Pieces.neighbs.length; i++){
            var off = Pieces.neighbs[i];
            console.log((x + off[0]) + " " + (y + off[1]));
            if(Pieces.inGrid(x +off[0],y + off[1]) 
               && !Pieces.grid[x+off[0]][y + off[1]] 
                 && !Pieces.growth[x+off[0]][y + off[1]] 
               && Pieces.grid[x][y].score > scoreThreshold 
               && Math.random() > growthRate){
                    console.log("Score: " + Pieces.grid[x][y].score);
                grows = true;
                Pieces.growth[x +off[0]][y + off[1]] = new Piece(x +off[0],y + off[1],"Growth",Math.floor(Pieces.grid[x][y].score/4),Pieces.grid[x][y].sub,false,false);
               // console.log("GROWING " + x + " " + y);
                Pieces.growth[x +off[0]][y + off[1]].mesh[0].material.opacity = 0.33;
                Pieces.grid[x][y].score = Math.floor(Pieces.grid[x][y].score *  0.75);
                }
            }
        
    return grows;
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
            for(var x = 0; x < KGDN.grid[0]; x++){
        for(var y = 0; y < KGDN.grid[1]; y++){
            if(Pieces.growth[x][y] != undefined){
            Pieces.grid[x][y] = Pieces.growth[x][y];
                Pieces.grid[x][y].mesh[0].material.opacity = 1;  
                }
            }}

        for(var x = 0; x < KGDN.grid[0]; x++){
        Pieces.growth[x] = [];
        for(var y = 0; y < KGDN.grid[1]; y++){
            Pieces.growth[x][y] = undefined;
            }}
    
    for (var x = 0; x <  KGDN.grid[1]; x++){
        var neiStr = " "; 
        for(var y = 0; y < KGDN.grid[0]; y++){
            
                if(!Pieces.grid[x][y].stem && Pieces.grid[x][y].sub != undefined ){   
                    var sub = Pieces.grid[x][y].sub;
                    neiStr += " " +  Pieces.growByAdjCount(x,y,
                                                           Pieces.growthParams[sub][0], Pieces.growthParams[sub][1])
                    
                        ? "X" : "_";
                    }
                       
            }


   //   console.log(neiStr);
        }
};
    
            


Pieces.loadPiece = function(subreddit,stem,x,y,falling){
    if (x === undefined || y === undefined || falling === undefined){
        x = _.random(KGDN.grid[0]-1);
        y =  _.random(KGDN.grid[1]-1);
 //       console.log("Autoplacing piece..");
        falling = true;
        }

    var urlBase = stem ? "stem" : "flower";
    var req = Pieces.nextReq++;
   // console.log("Loading " + urlBase + " - " + subreddit + " " + req);
    var unrealizedPiece = new Piece(x,y,
                           
                            "Unrealized", 
                            -10 ,
                           subreddit,
                            stem,falling);
    $.getJSON(urlBase + "/" +  subreddit + "/" + req, 
              function(data){
                //  console.log("Receiving" + urlBase + " - " + subreddit + " " + req);
                  unrealizedPiece.text = data["text"];
                  if(data["parent-body"] != undefined){
                      
                      unrealizedPiece.parentBody = data["parent-body"];
                      //alert(unrealizedPiece.parentBody);
                      }
                  unrealizedPiece.score = data["ups"] - data["downs"];
                  if(!falling)
                      unrealizedPiece.place();
                                           });
    return unrealizedPiece;
};
