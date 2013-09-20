Pieces = {};
Pieces.nextID = 0;

Pieces.unplacedQueue = [];

Pieces.init = function(){
    Pieces.stemTxt = THREE.ImageUtils.loadTexture("/img/stem.png");
    Pieces.fallingTxt = THREE.ImageUtils.loadTexture("/img/drop.gif");
    Pieces.flowerTxt = {};
    for(var i = 0; i < KGDN.subreddits.length; i++){
        Pieces.flowerTxt[KGDN.subreddits[i]] = THREE.ImageUtils.loadTexture("/img/piece" + i + ".png");
        }

    Pieces.falling = new Piece(Cursor.gridX,
                              Cursor.gridY,
                              "hi",
                              25,
                              KGDN.subreddits[_.random(KGDN.subreddits.length-1)],
                                              false);
    alert(Pieces.falling.z);
    };




Pieces.loadPiece = function(subreddit,stem){
    
    console.log("Loading");
    var urlBase = stem ? "stem" : "flower";
    $.getJSON(urlBase + "/" +  subreddit, 
              function(data){ 
                  Pieces.unplacedQueue.push(new Piece(_.random(KGDN.gridWidth-1),
                            _.random(KGDN.gridWidth-1),
                            data["text"], 
                            data["ups"],false,
                            data["subreddit"]));
                                           });
};
