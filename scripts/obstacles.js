// environmental obstacles spawned with level creation

// root class that all other obstacles inherit from
class Obstacle {
    constructor(scene, x, y, width, height, sprite, demolishedHeight) {
        this.objectType = "Obstacle";
        this.sprite = scene.add.tileSprite(x + width/2, y, width, height, sprite).setOrigin(0.5, 0.5);
        scene.matter.add.gameObject(this.sprite);
        this.sprite.body.isStatic = true;
        this.scene = scene;
        this.demolishedHeight = demolishedHeight;
        this.saved = false;
        this.blockNo = scene.blockNo;
    }

    Demolish() {
        console.log("demoish")
        // TODO: demolish animation
        let temp = this.sprite.height;
        this.sprite.height = this.demolishedHeight;

        // Update the body's properties
        this.sprite.body.vertices[0].y += (temp - this.sprite.height) * 0.5;
        this.sprite.body.vertices[1].y += (temp - this.sprite.height) * 0.5;

        this.saved = false;
    }

    JSON() {
        const obj = {
            objectType: this.objectType,
            width: this.sprite.width,
            height: this.sprite.height
        };

        return obj;
    }
}

// specific maker for root Obstacle class
function ObstacleMaker(scene, jsonObj, sprite) {
    const width = jsonObj.width;
    const height = jsonObj.height;
    let obj = new Obstacle(scene, 
        scene.boxQueue.at(-1).sprite.x + (scene.boxQueue.at(-1).sprite.width/2), scene.base, 
        width, height, sprite, 
        scene.demolishedHeight, jsonObj.demolished);
    return obj;
}

// ==================================================================================

// explodable

class Explodable extends Obstacle {
    constructor(scene, x, y, width, height, demolishedHeight) {
        super(scene, x, y, width, height, "explodable", demolishedHeight);
        this.objectType = "Explodable";
        this.weatherStep = scene.maxHeight * 0.1;
    }
    
    Weather() {
        if(this.sprite.height > this.demolishedHeight) {
            let temp = this.sprite.height;
            this.sprite.height -= this.weatherStep;
            if(this.sprite.height < this.demolishedHeight) this.sprite.height = this.demolishedHeight;

            // Update the body's properties
            this.sprite.body.vertices[0].y += (temp - this.sprite.height) * 0.5;
            this.sprite.body.vertices[1].y += (temp - this.sprite.height) * 0.5;

            this.saved = false;
        }
    }
}

// specific maker for explodable class
function ExplodableMaker(scene, jsonObj) {
    console.log("weather")
    const width = jsonObj.width;
    const height = jsonObj.height;
    let obj = new Explodable(scene, 
        scene.boxQueue.at(-1).sprite.x + (scene.boxQueue.at(-1).sprite.width/2), scene.base, 
        width, height, 
        scene.demolishedHeight);
    obj.saved = true;
    return obj;
}

// weatherable

class Weatherable extends Obstacle {
    constructor(scene, x, y, width, height, demolishedHeight) {
        super(scene, x, y, width, height, "weatherable", demolishedHeight);
        this.objectType = "Weatherable";
        this.weatherStep = scene.maxHeight * 0.3;
    }

    Weather() {
        if(this.sprite.height > this.demolishedHeight) {
            let temp = this.sprite.height;
            this.sprite.height -= this.weatherStep;
            if(this.sprite.height < this.demolishedHeight) this.sprite.height = this.demolishedHeight;

            // Update the body's properties
            this.sprite.body.vertices[0].y += (temp - this.sprite.height) * 0.5;
            this.sprite.body.vertices[1].y += (temp - this.sprite.height) * 0.5;

            this.saved = false;
        }
    }
}

function WeatherableMaker(scene, jsonObj) {
    const width = jsonObj.width;
    const height = jsonObj.height;
    let obj = new Weatherable(scene, 
        scene.boxQueue.at(-1).sprite.x + (scene.boxQueue.at(-1).sprite.width/2), scene.base, 
        width, height, 
        scene.demolishedHeight);
    obj.saved = true;
    return obj;
}

// bedrock

class Bedrock extends Obstacle {
    constructor(scene, x, y, width, height, demolishedHeight) {
        super(scene, x, y, width, height, "bedrock", demolishedHeight);
        this.objectType = "Bedrock";
    }
}

// specific maker for bedrock class
function BedrockMaker(scene, jsonObj) {
    const width = jsonObj.width;
    const height = jsonObj.height;
    let obj = new Bedrock(scene, 
        scene.boxQueue.at(-1).sprite.x + (scene.boxQueue.at(-1).sprite.width/2), scene.base, 
        width, height, 
        scene.demolishedHeight);
    obj.saved = true;
    return obj;
}