const synth = new Tone.Synth().toDestination();
class RunnerLevel extends Phaser.Scene {
    constructor(name="RunnerLevel", /*seed="12345",*/ speed=0.7, maxWidth=500, minWidth=200, maxHeight=1000, minHeight=150) {
        super(name);
        this.rand = new Math.seedrandom(String(Math.random())); // this.rand() returns random number from 0 to 1

        // screen size vars
        this.base = game.config.height;
        this.width = game.config.width;
        this.mid = this.width / 2;

        this.maxSpeed = speed; // max speed level can move at
        this.slowest = 0.4; // slowest speed platforms will move at
        this.speed = this.slowest; // speed platforms will move at (and objects)
        this.rate = 0.000005; // rate speed increases

        this.boxQueue = []; // queue containing platform boxes, .push(item) to enqueue, .shift() to dequeue
        this.maxWidth = maxWidth; // max width of a box
        this.minWidth = minWidth; // min width of a box
        this.maxHeight = maxHeight; // max height of a box
        this.minHeight = minHeight; // min height of a box
        this.demolishedHeight = minHeight; // height obstacles will be set at when demolished
        // probabilities of each obstacle object type being generated, must add up to 1
        this.probs = [
            {prob: 0.2, type: Explodable},
            {prob: 0.7, type: Weatherable},
            {prob: 0.1, type: Bedrock}, 
        ];

        this.placed = []; // list placeables that have been placed

        this.pList = new LoadList(this, "P"); // placeables loader list
        this.progress = this.width; // float that will track the relative x coord progress (px) of the player, used as the key for local storage
        this.objSpawn = this.width + 300; // x coord for object load points

        this.loader = new Loader(this); // obstacles loader list
        this.blockNo = 0; //index of the next block to be loader

        this.start = this.width/5; // start point for player
    }

    preload() {
        this.load.path = "assets/";

        // environment blocks
        this.load.image("explodable", "explodable.png");
        this.load.image("weatherable", "weatherable.png");
        this.load.image("bedrock", "bedrock.png");

        // placeables
        this.load.image("bomb", "bomb.png");
        this.load.image("waterbucket", "waterbucket.png");
        this.load.image("jumppad", "jumppad.png");
        this.load.image("ramp", "ramp.png");

        this.load.image("belt", "belt-placeholder.png");

        // player
        this.load.image("minecart", "minecart.png");
        this.load.image("wheel", "wheel.png");
        this.load.audio("letsroll", "letsroll.mp3");
    }

    addBox(x, y, width=0, height=0) {

        this.blockNo += 1;
        // check if object should be placed
        if(this.boxQueue.length > 0) {
            let obj = this.loader.Load("O" + String(this.blockNo));
            if (obj != null) {
                return obj;
            }
        }

        // generate new blocks
        if (width <= 0) { 
            width = this.minWidth + (this.rand() * (this.maxWidth - this.minWidth)); 
        }
        if (height <= 0) { 
            height = this.minHeight + (this.rand() * (this.maxHeight - this.minHeight)); 
        }

        const pick = this.rand(); // random number from [0, 1)
        let total = 0;
        for (let i = 0; i < this.probs.length; i++) {
            total += this.probs[i].prob;
            if (pick < total) {
                return new this.probs[i].type(this, x, y, width, height, this.demolishedHeight);
            }
        }
    }

    create() {
        this.sound.add("letsroll").play();
        this.floorLayer = this.matter.world.nextCategory();

        this.boxQueue.push(
            this.addBox(this.mid/2, this.base, this.width*2, this.minHeight)
        );

        // create conveyer belt
        this.belt = new Belt(this, this.width * 0.7, this.base * 0.1);
        
        // create player
        this.player = new Player(this, this.start, this.base/2);

        // pause button TODO: encapsulate in class
        this.paused = false; // tru if paused
        let pauseButton = this.add.text(100, 100, "⏸️", { fontSize: 100 })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                if (this.paused) {
                    this.scene.resume();
                } else {
                    this.scene.pause();
                    localStorage.clear();
                }
            });
    }

    // remove object from placed list
    removeObject(i) {
        this.placed[i].sprite.destroy();
        this.placed[i] = null;
        this.placed.splice(i, 1);
    }
    // delta contains the time since the last frame update
    update(time, delta) {
        this.player.Structure(); // keep player together, and moving
        if (this.player.isStuck(this.boxQueue)) { // check if player has hit a wall
            console.log("gameOver");

            //play a middle 'C' for the duration of an 8th note
            console.log(synth.triggerAttackRelease("C4", "8n"));
            this.scene.pause(); // TODO: replace with actual game over
        }

        if (this.speed < this.maxSpeed) {
            this.speed += this.rate * delta; // increase speed
        }

        this.belt.Update(delta); // run update function for belt

        // update box positions
        for(let i = 0; i < this.boxQueue.length; i++) {
            this.boxQueue[i].sprite.x -= this.speed * delta;
        }

        // update progress
        this.progress += this.speed * delta;

        // check for next placeable to be loaded
        let temp = this.pList.Load(parseInt(this.progress));

        // update object positions, and check if any should be destroyed
        for(let i = 0; i < this.placed.length; i++) {
            this.placed[i].sprite.x -= this.speed * delta; // update position

            // save object
            if(this.placed[i].sprite.x <= 0) {
                if (!this.placed[i].saved) {
                    this.pList.Insert(this.placed[i]);
                    this.placed[i].saved = true;
                }
            }

            // destroy object
            if(this.placed[i].sprite.x <= -(this.placed[i].sprite.width + 200)) {
                this.removeObject(i);
            }
        }

        // check if next block should be created, create a new block if the last block is partially on screen
        if(this.boxQueue.at(-1).sprite.x <= this.width) {
            this.boxQueue.push(
                this.addBox(this.boxQueue.at(-1).sprite.x + (this.boxQueue.at(-1).sprite.width/2), 
                    this.base)
            )
        }

        // check if last box should be removed, remove if 2nd to last box is partially off screen
        if (this.boxQueue.length > 1) {
            if(this.boxQueue[1].sprite.x <= -this.maxWidth) {
                let temp = this.boxQueue.shift();
                if (!temp.saved) {
                    this.loader.Save("O" + String(temp.blockNo), temp);
                    temp.saved = true;
                }
                temp.sprite.destroy();
                temp = null;
            }
        }    
    }
}