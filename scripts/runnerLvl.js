class RunnerLevel extends Phaser.Scene {
    constructor(name="RunnerLevel", seed="12345", speed=0.25, maxWidth=500, minWidth=200, maxHeight=1000, minHeight=150) {
        super(name);
        this.rand = new Math.seedrandom(seed); // this.rand() returns random number from 0 to 1
        this.base = game.config.height;
        this.width = game.config.width;
        this.mid = this.width / 2;
        this.boxQueue = []; // queue containing platform boxes, .push(item) to enqueue, .shift() to dequeue
        this.speed = speed; // speed platforms will move at
        this.maxWidth = maxWidth; // max width of a box
        this.minWidth = minWidth; // min width of a box
        this.maxHeight = maxHeight; // max height of a box
        this.minHeight = minHeight; // min height of a box
    }

    preload() {
        this.load.path = "/assets/";
        this.load.image("block", "placeholder.JPG");
    }

    addBox(x, y, width=0, height=0) {
        if (width <= 0) { 
            width = this.minWidth + (this.rand() * (this.maxWidth - this.minWidth)); 
        }
        if (height <= 0) { 
            height = this.minHeight + (this.rand() * (this.maxHeight - this.minHeight)); 
        }

        //console.log(width, height);
        let box = this.add.tileSprite(x + width / 2, y, width, height, "block");
        this.physics.add.existing(box);
        box.body.setImmovable();
        box.setOrigin(0.5, 0.5);
        return box;
    }

    create() {
        this.boxQueue.push(
            this.addBox(this.mid, this.base, this.width, this.maxWidth / 2)
        );
    }

    // delta contains the time since the last frame update
    update(time, delta) {
        // update box positions
        for(let i = 0; i < this.boxQueue.length; i++) {
            this.boxQueue[i].x -= this.speed * delta;
        }

        // check if next block should be created, create a new block if the last block is partially on screen
        if(this.boxQueue[this.boxQueue.length - 1].x <= this.width) {
            this.boxQueue.push(
                this.addBox(this.boxQueue[this.boxQueue.length - 1].x + (this.boxQueue[this.boxQueue.length - 1].width/2), 
                    this.base)
            )
        }

        // check if last box should be removed, remove if 2nd to last box is partially off screen
        if(this.boxQueue[1].x <= 0) {
            let temp = this.boxQueue.shift();
            temp.destroy();
            temp = null;
        }
    }
}