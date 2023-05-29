// environmental obstacles spawned with level creation

// root class that all other obstacles inherit from
class Obstacle {
    constructor(scene, x, y, width, height, sprite, demolishedHeight) {
        this.objectType = "Obstacle";
        this.sprite = scene.add.tileSprite(x, y, width, height, sprite).setOrigin(0.5, 0.5);
        scene.matter.add.gameObject(this.sprite);
        this.sprite.body.isStatic = true;
        this.scene = scene;
        this.demolished = demolished;
        this.demolishedHeight = demolishedHeight;
    }

    Demolish() {
        // TODO: demolish animation
        this.sprite.height = this.demolishedHeight;
    }

    JSON() {
        const obj = {
            objectType: this.objectType,
            height: this.sprite.height
        };

        return obj;
    }
}

// specific maker for root Obstacle class
function ObstacleMaker(scene, jsonObj, sprite) {
    const rand = scene.rand;
    const width = scene.minWidth + (rand() * (scene.maxWidth - scene.minWidth));
    let dummy = rand(); // dummy rand call to keep random seed synchronized
    const height = jsonObj.height;
    let obj = new Obstacle(scene, 
        scene.boxQueue[scene.boxQueue.length - 1].x + (scene.boxQueue[scene.boxQueue.length - 1].width/2), scene.base, 
        width, height, sprite, 
        scene.demolishedHeight, jsonObj.demolished);
    return obj;
}

// explodable

class Explodable extends Obstacle {
    constructor(scene, x, y, width, height, sprite, demolishedHeight) {
        super(scene, x, y, width, height, sprite, demolishedHeight);
        this.objectType = "Explodable";
        this.weatherStep = scene.maxHeight * 0.1;
    }
    
    Weather() {
        this.sprite.height -= this.weatherStep;
        if(this.sprite.height < this.demolishedHeight) this.sprite.height = this.demolishedHeight;
    }
}

// specific maker for explodable class
function ExplodableMaker(scene, jsonObj) {
    return ObstacleMaker(scene, jsonObj, "explodable");
}

// weatherable

class Weatherable extends Obstacle {
    constructor(scene, x, y, width, height, sprite, demolishedHeight) {
        super(scene, x, y, width, height, sprite, demolishedHeight);
        this.objectType = "Weatherable";
        this.weatherStep = scene.maxHeight * 0.3;
    }

    Weather() {
        this.sprite.height -= this.weatherStep;
        if(this.sprite.height < this.demolishedHeight) this.sprite.height = this.demolishedHeight;
    }
}

function WeatherableMaker(scene, jsonObj) {
    return ObstacleMaker(scene, jsonObj, "weatherable");
}

// bedrock

class Bedrock extends Obstacle {
    constructor(scene, x, y, width, height, sprite, demolishedHeight) {
        super(scene, x, y, width, height, sprite, demolishedHeight);
        this.objectType = "Bedrock"
    }
}

// specific maker for bedrock class
function BedrockMaker(scene, jsonObj) {
    return ObstacleMaker(scene, jsonObj, "bedrock");
}