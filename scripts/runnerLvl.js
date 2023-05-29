class RunnerLevel extends Phaser.Scene {
    constructor(name="RunnerLevel", seed="12345", speed=0.25, maxWidth=500, minWidth=200, maxHeight=1000, minHeight=150) {
        super(name);
        this.rand = new Math.seedrandom(seed); // this.rand() returns random number from 0 to 1

        // screen size vars
        this.base = game.config.height;
        this.width = game.config.width;
        this.mid = this.width / 2;

        this.speed = speed; // speed platforms will move at (and objects)

        this.boxQueue = []; // queue containing platform boxes, .push(item) to enqueue, .shift() to dequeue
        this.maxWidth = maxWidth; // max width of a box
        this.minWidth = minWidth; // min width of a box
        this.maxHeight = maxHeight; // max height of a box
        this.minHeight = minHeight; // min height of a box
        this.demolishHeight = minHeight; // height obstacles will be set at when demolished
        // probabilities of each obst object type being generated, must add up to 1
        this.probs = [
            {prob: 0.2, type: Explodable},
            {prob: 0.7, type: Weatherable},
            {prob: 0.1, type: Bedrock}, 
        ];

        this.placed = []; // list placeables that have been placed

        this.loader = new Loader(this); // object loader
        this.progress = 0; // int that will track the relative x coord progress of the player, used as the key for local storage
        this.objSpawn = this.width + 300; // x coord for object load points
    }

    preload() {
        this.load.path = "assets/";
        this.load.image("block", "placeholder.JPG");
        this.load.image("belt", "belt-placeholder.png");
    }

    addBox(x, y, width=0, height=0) {
        if (width <= 0) { 
            width = this.minWidth + (this.rand() * (this.maxWidth - this.minWidth)); 
        }
        if (height <= 0) { 
            height = this.minHeight + (this.rand() * (this.maxHeight - this.minHeight)); 
        }

        // check if object should be placed
        let obj = this.loader.Load("O" + String(this.progress));
        if (obj != null) {
            return obj;
        }

        const pick = this.rand(); // random number from [0, 1)
        
        let total = 0;
        for (let i = 0; i < this.probs.length; i++) {
            total += this.probs[i].prob;
            if (pick < total) {
                return new this.probs[i].type(this, x, y, width, height, sprite, this.demolishHeight);
            }
        }
    }

    create() {
        this.boxQueue.push(
            this.addBox(this.mid, this.base, this.width, this.maxWidth / 2)
        );

        // create conveyer belt
        this.belt = new Belt(this, this.width * 0.7, this.base * 0.1);
    }

    // remove object from placed list
    removeObject(i) {
        this.placed[i].sprite.destroy();
        this.placed[i] = null;
        this.placed.splice(i, 1);
    }

    // delta contains the time since the last frame update
    update(time, delta) {
        this.belt.Update(delta); // run update function for belt

        // update box positions
        for(let i = 0; i < this.boxQueue.length; i++) {
            this.boxQueue[i].x -= this.speed * delta;
        }

        // update progress
        this.progress += 1;

        // check if object should be placed
        this.loader.Load("P" + String(this.progress));

        // update object positions, and check if any should be destroyed
        for(let i = 0; i < this.placed.length; i++) {
            this.placed[i].sprite.x -= this.speed * delta; // update position

            // save object
            if(this.placed[i].sprite.x <= 0 - this.placed[i].sprite.width) {
                if (!this.placed[i].saved) {
                    this.loader.Save("P" + String(this.progress - 570), this.placed[i]);
                    this.placed[i].saved = true;
                }
            }

            // destroy object
            if(this.placed[i].sprite.x <= -(this.placed[i].sprite.width + 200)) {
                this.removeObject(i);
            }
        }

        // check if next block should be created, create a new block if the last block is partially on screen
        if(this.boxQueue[this.boxQueue.length - 1].x <= this.width) {
            this.boxQueue.push(
                this.addBox(this.boxQueue[this.boxQueue.length - 1].x + (this.boxQueue[this.boxQueue.length - 1].width/2), 
                    this.base)
            )
        }

        // check if last box should be removed, remove if 2nd to last box is partially off screen
        if(this.boxQueue[1].x <= -this.maxWidth) {
            let temp = this.boxQueue.shift();
            this.loader.Save("O" + String(this.progress - 570), temp);
            temp.sprite.destroy();
            temp = null;
        }       
    }
}