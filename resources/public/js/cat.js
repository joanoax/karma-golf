
Cat.velocity = 3;


function Cat(position,stem,type){
    this.mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(60,60),
        new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("/img/cat" + _.random(1,4) + ".png"),
                                       transparent: true,
                                       opacity: 1}));

    this.mesh2 = new THREE.Mesh(
        new THREE.PlaneGeometry(50,50),
        new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("/img/convo-bottom.png"),
                                       transparent: true,
                                       opacity: 1}));
 
    var color = new THREE.Color().setRGB(_.random(255),_.random(255),_.random(255));
    this.mesh.position = position;
    KGDN.scene.add(this.mesh)
    };

Cat.prototype.kill = function (){
    KGDN.scene.remove(this.mesh);
    };

Cat.prototype.update = function () { 
    this.mesh.position.z += Cat.velocity;
    if(this.mesh.position.z > 0)
        this.kill();
    };
