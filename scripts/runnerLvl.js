

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

    init(data) {
        if (data.muted != undefined) {
            this.muted = data.muted; // get if scene should be muted
        } else {
            this.muted = localStorage.getItem("muted") == "true" ? true : false;
        }
    }

    preload() {
        this.load.path = "assets/";

        // background
        this.load.image("back", "background.png");

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

        // UI
        this.load.image("board", "board.png");

        // tutorial
        this.load.image("tut1", "tutorial1.png");
        this.load.image("tut2", "tutorial2.png");
        this.load.image("tut3", "tutorial3.png");

        // reset containers
        this.progress = this.width;
        this.speed = this.slowest; // speed platforms will move at (and objects)

        this.boxQueue = [];
        this.placed = [];

        this.pList = new LoadList(this, "P");

        this.loader = new Loader(this); // obstacles loader list
        this.blockNo = 0; //index of the next block to be loader

        let temp = localStorage.getItem(String("score"));
        this.highscore = temp == null ? 0 : temp;
    }

    addBox(x, y, width=0, height=0) {

        this.blockNo += 1;
        // check if object should be placed
        let obj = this.loader.Load("O" + String(this.blockNo));
        if (obj != null) {
            return obj;
        }

        // generate new blocks
        if (width <= 0) { 
            width = this.minWidth + (this.rand() * (this.maxWidth - this.minWidth)); 
        }
        if (height <= 0) { 
            height = this.minHeight + (this.rand() * (this.maxHeight - this.minHeight)); 
        }

        const pick = this.boxQueue.length == 0 ? 0.99 : this.rand(); // random number from [0, 1)
        let total = 0;
        for (let i = 0; i < this.probs.length; i++) {
            total += this.probs[i].prob;
            if (pick < total) {
                return new this.probs[i].type(this, x, y, width, height, this.demolishedHeight);
            }
        }
    }

    create() {
        this.home = false;

        this.back = this.add.image(this.width/2, this.base/2, "back").setOrigin(0.5,0.5).setScale(3);
        // tutorial
        this.tut1 = this.add.image(0, 0, "tut1").setOrigin(0.5, 0.5);
        this.tut2 = this.add.image(1000, 0, "tut2").setOrigin(0.5, 0.5);
        this.tut3 = this.add.image(2000, 0, "tut3").setOrigin(0.5, 0.5);
        this.tutorials = this.add.container(this.width, this.base * 0.5);
        this.tutorials.add([this.tut1, this.tut2, this.tut3]);

        if (this.floorLayer == undefined) {
            console.log("created floor layer")
            this.floorLayer = this.matter.world.nextCategory();
        }

        this.boxQueue.push(
            this.addBox(this.mid/2, this.base, this.width*2.5, this.minHeight)
        );

        // create conveyer belt
        this.belt = new Belt(this, this.width * 0.65, this.base * 0.1);
        
        // create player
        this.player = new Player(this, this.start, this.base/2);

        // pause button
        this.pause = new PauseButton(this);
        
        // score board
        this.scoreText = this.add.text(0, 0, "Score: ",
            {
                font:"50px Arial",
                align: "center",
                color: "#FFFFFF",
            }).setOrigin(0.5, 0.5);
        this.highText = this.add.text(0, 60, "Highscore: ",
            {
                font:"50px Arial",
                align: "center",
                color: "#FFFFFF",
            }).setOrigin(0.5, 0.5);
        
        this.scoreBoard = this.add.container(200, 300);
        this.scoreBoard.add([this.scoreText, this.highText]);

        Tone.Transport.stop();
        Tone.Transport.cancel();
        synth2.volume.value = -16; 
        synth3.volume.value = -16;
        synth4.volume.value = -16;
        Tone.Transport.bpm.value = 160;
        this.seq1 = new Tone.Sequence((time, note) => {
            synth1.triggerAttackRelease(note, 0.1, time);
        }, ["F2","F2","F2","F2","F2","F2","F2","F2","F2","F2","F2","F2","F2","F2","F2","F2","C#2","C#2","C#2","C#2","C#2","C#2","C#2","C#2","C2","C2","C2","C2","C2","C2","C2","C2"]).start(0);
        this.seq2 = new Tone.Sequence((time, note) => {
            synth2.triggerAttackRelease(note, 0.1, time);
        }, ["G#3","G#3","G#3","G#3","G#3","G#3","G#3","G#3","F3","F3","F3","F3","F3","F3","F3","F3","B3","B3","B3","B3","B3","B3","B3","B3","G3","G3","G3","G3","G3","G3","G3","G3","G#3","G#3","G#3","G#3","G#3","G#3","G#3","G#3","F3","F3","F3","F3","F3","F3","F3","F3","C#4","C#4","C#4","C#4","C#4","C#4","C#4","C#4","C4","C4","C4","C4","C4","C4","C4","C4",]).start("8m");
        this.seq3 = new Tone.Sequence((time, note) => {
            synth3.triggerAttackRelease(note, 0.1, time);
        }, ["C5","C5","C5","C5","C5","C5","C5","C5","G#4","G#4","G#4","G#4","G#4","G#4","G#4","G#4","B4","B4","B4","B4","B4","B4","B4","B4","E4","E4","E4","E4","E4","E4","E4","E4","C5","C5","C5","C5","C5","C5","C5","C5","G#4","G#4","G#4","G#4","G#4","G#4","G#4","G#4","C#5","C#5","C#5","C#5","C#5","C#5","C#5","C#5","E5","E5","E5","E5","E5","E5","E5","E5",]).start("16m");
        this.seq4 = new Tone.Sequence((time, note) => {
            synth4.triggerAttackRelease(note, 0.1, time);
        }, ["F5","G5","G#5","G5","F5","G5","G#5","G5","F5","G5","G#5","G5","F5","G5","G#5","G5","F5","G#5","F5","G#5","F5","G#5","F5","G#5","G5","C6","G5","C6","G5","C6","G5","C6","F5","G5","G#5","G5","F5","G5","G#5","G5","F5","G5","G#5","G5","F5","G5","G#5","G5","F5","G#5","F5","G#5","F5","G#5","F5","G#5","G5","C6","G5","C6","G5","C6","G5","C6",]).start("24m");
        if (!this.muted) Tone.Transport.start();
    }

    dispose() {
        this.seq1.dispose();
        this.seq2.dispose();
        this.seq3.dispose();
        this.seq4.dispose();
    }

    // remove object from placed list
    removeObject(i) {
        this.placed[i].sprite.destroy();
        this.placed[i] = null;
        this.placed.splice(i, 1);
    }

    // delta contains the time since the last frame update
    update(time, delta) {
        if (this.home) {
            this.scene.start("Title", {muted: this.muted});
            this.dispose();
        }


        // move tutorials
        if (this.tutorials != null) {
            this.tutorials.x -= this.speed * delta;
            if (this.tutorials.x < -3000) {
                this.tutorials.destroy();
                this.tutorials = null;
            }
        }

        // update score:
        this.scoreText.setText(`Score: ${parseInt((this.progress - this.width) / 100)}`);
        let highscore = this.highscore == 0 ? 0 : parseInt((this.highscore - this.width) / 100);
        this.highText.setText(`Highscore: ${highscore}`);

        this.player.Structure(); // keep player together, and moving
        if (this.player.isStuck(this.boxQueue, this.placed)) { // check if player has hit a wall
            // update highscore
            if (this.progress > this.highscore) {
                localStorage.setItem( "score", String(parseInt(this.progress)) );
                console.log("new highscore: ", this.progress);
            }

            console.log("gameOver");
            Tone.Transport.stop();
            Tone.Transport.cancel();
            this.dispose();
            this.scene.pause();
            this.scene.launch("GameOver", {cart: this.player});
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