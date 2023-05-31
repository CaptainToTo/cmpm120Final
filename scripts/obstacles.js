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
    }

    Demolish() {
        // TODO: demolish animation
        this.sprite.height = this.demolishedHeight;

        // Update the body's properties
        Matter.Body.scale(this.sprite.body, 
            this.sprite.body.width, this.sprite.height / this.sprite.body.height);
    }

    JSON() {
        const obj = {
            objectType: this.objectType,
            height: this.sprite.height
        };

        return obj;
    }

    // resize hitbox
    setSize(newWidth, newHeight) {
        // Store a reference to the Matter body associated with the sprite
        var body = this.sprite.body;

        // Get the center of the sprite
        var centerX = this.sprite.x;
        var centerY = this.sprite.y;

        // Update the body's vertices
        Matter.Vertices.scale(body.vertices, 
            newWidth / body.bounds.max.x, newHeight / body.bounds.max.y, 
            { x: centerX, y: centerY });

        // Recalculate the body's bounds and position
        Matter.Body.setParts(body, [body], true, false);
        Matter.Body.setPosition(body, { x: centerX, y: centerY });

        // Update the sprite's width and height
        this.sprite.width = newWidth;
        this.sprite.height = newHeight;
    }
}

// specific maker for root Obstacle class
function ObstacleMaker(scene, jsonObj, sprite) {
    const rand = scene.rand;
    const width = scene.minWidth + (rand() * (scene.maxWidth - scene.minWidth));
    rand(); rand(); // dummy rand calls to keep random seed synchronized, one for height, one for obj type pick
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
        console.log(this.sprite.body);
        this.sprite.height -= this.weatherStep;
        if(this.sprite.height < this.demolishedHeight) this.sprite.height = this.demolishedHeight;
        this.sprite.body.setSize(this.sprite.width, this.sprite.height);
    }
}

// specific maker for explodable class
function ExplodableMaker(scene, jsonObj) {
    let obj = ObstacleMaker(scene, jsonObj, "explodable");
    obj.objectType = "Explodable";
    obj.weatherStep = scene.maxHeight * 0.1;
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
        this.sprite.height -= this.weatherStep;
        if(this.sprite.height < this.demolishedHeight) this.sprite.height = this.demolishedHeight;

        // Update the body's properties
        this.setSize(this.sprite.width, this.sprite.height);
    }
}

function WeatherableMaker(scene, jsonObj) {
    let obj = ObstacleMaker(scene, jsonObj, "weatherable");
    obj.objectType = "Weatherable";
    obj.weatherStep = scene.maxHeight * 0.3;
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
    let obj = ObstacleMaker(scene, jsonObj, "bedrock");
    obj.objectType = "Bedrock";
    return obj;
}