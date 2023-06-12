// player object, if it is pushed back by the terrain, then it will trigger a game over

class Player {
    constructor(scene, x, y, start=0, threshold=0) {
        this.x = x;
        this.y = y;
        this.h = 0;
        this.w = 80;
        this.t = 0.2;

        this.stuckTime = 0;
        this.stuckTimeoutDuration = 500;

        // build sprite
        this.minecart = scene.add.sprite(this.x, this.y, "minecart").setOrigin(0.5, 1);

        this.frontWheel = scene.matter.add.sprite(this.x + this.w, this.y + this.h, "wheel").setOrigin(0.5, 0.5);
        this.frontWheel.setCircle();
        //this.frontWheel.setFriction(1, 0.0001);
        //this.frontWheel.setMass(1);

        this.backWheel = scene.matter.add.sprite(this.x - this.w, this.y + this.h, "wheel").setOrigin(0.5, 0.5);
        this.backWheel.setCircle();
        //this.backWheel.setMass(1);

        scene.frontWheelLayer = scene.matter.world.nextCategory();
        this.frontWheel.setCollisionCategory(scene.frontWheelLayer);
        this.frontWheel.setCollidesWith([scene.frontWheelLayer, scene.floorLayer]);

        scene.backWheelLayer = scene.matter.world.nextCategory();
        this.backWheel.setCollisionCategory(scene.backWheelLayer);
        this.backWheel.setCollidesWith([scene.backWheelLayer, scene.floorLayer]);

        this.scene = scene;

        // start is the x position the minecart will try to get to if it has been pushed back
        this.start = start == 0 ? x: start;

        this.threshold = threshold; // the threshold x position to trigger a game over

        if (this.start < this.threshold) {
            console.error("threshold should not be greater than start point; start: ", 
                this.start, ", threshold: ", this.threshold);
        }
    }

    // called by scene update(), keeps minecart attached to wheels, all positions depend on front wheel
    Structure() {
        this.frontWheel.x = this.start;

        // get distance between wheels
        let diff = {
            x: this.frontWheel.x - this.backWheel.x,
            y: this.frontWheel.y - this.backWheel.y
        };
        if (diff.x < this.w) diff.x = this.w;
        let angle = Math.atan(diff.y/diff.x); // angle = arctan(y/x)

        // fix backwheel position
        let backWheelFix = {
            x: this.frontWheel.x - (Math.cos(angle) * (this.w * 2)),
            y: this.frontWheel.y - (Math.sin(angle) * (this.w * 2))
        }
        this.backWheel.setPosition(backWheelFix.x, backWheelFix.y);

        // set minecart position rotation
        let midpoint = {
            x: this.frontWheel.x - ((Math.cos(angle) * (this.w * 2)) / 2),
            y: this.frontWheel.y - ((Math.sin(angle) * (this.w * 2)) / 2)
        };

        let minecartFix = {
            x: midpoint.x,
            y: midpoint.y - this.h
        };
        this.minecart.setPosition(minecartFix.x, minecartFix.y);
        this.minecart.setRotation(angle);

        // set x and y
        this.x = this.minecart.x;
        this.y = this.minecart.y;

        // set the torque of the front wheel, stop if minecart is at the front of the scene
        this.frontWheel.body.torque = this.t;
        this.backWheel.body.torque = this.t;
    }

    // check if minecart has hit a wall
    isStuck(boxQueue, placed) {
        for (let i = 0; i < boxQueue.length; i++) {
            const body = boxQueue[i].sprite.body;

            if (this.scene.matter.containsPoint(body, this.frontWheel.x, this.frontWheel.y)) {
                return true;
            }
        }
        for (let i = 0; i < placed.length; i++) {
            if (placed[i].objectType != "Block") continue;
            const body = placed[i].sprite.body;

            if (this.scene.matter.containsPoint(body, this.frontWheel.x, this.frontWheel.y)) {
                return true;
            }
        }

        return false;
    }

    destroy() {
        let obj = {
            cart: {
                x: this.minecart.x,
                y: this.minecart.y
            },
            backWheel: {
                x: this.backWheel.x,
                y: this.backWheel.y
            },
            frontWheel: {
                x: this.frontWheel.x,
                y: this.frontWheel.y
            },
            h: this.h,
            w: this.w
        }
        this.minecart.destroy();
        this.backWheel.destroy();
        this.frontWheel.destroy();
        return obj;
    }
}


// debug scene for player class
class PlayerDebug extends Phaser.Scene {
    constructor() {
        super("PlayerDebug");
    }

    preload() {
        this.load.path = "assets/";

        this.load.image("minecart", "minecart.png");
        this.load.image("wheel", "wheel.png");
        this.load.image("block", "bedrock.png");
    }

    create() {
        this.floor = this.add.tileSprite(game.canvas.width/2 - 500, game.canvas.height, 
            game.canvas.width, 400, "block").setOrigin(0.5, 0.5);
        this.matter.add.gameObject(this.floor);
        this.floor.body.isStatic = true;
        this.floor.setAngle(-20);
        this.floorLayer = this.matter.world.nextCategory();
        this.floor.setCollisionCategory(this.floorLayer);

        this.floor2 = this.add.tileSprite(game.canvas.width/2, game.canvas.height, 
            game.canvas.width, 400, "block").setOrigin(0.5, 0.5);
        this.matter.add.gameObject(this.floor2);
        this.floor2.body.isStatic = true;
        this.floor2.setCollisionCategory(this.floorLayer);

        this.player = new Player(this, 100, game.canvas.height/2);
    }

    update() {
        this.player.Structure();
    }
}