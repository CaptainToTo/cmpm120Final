class Start extends Phaser.Scene {
    constructor() {
        super('Start')
    }
    create() {
        this.add.text(game.canvas.width / 2 - 200, game.canvas.height / 2 - 50, "Click anywhere to begin.",
            {
                font:"40px Arial",
                align: "center",
                color: "#FFFFFF",
            });
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(500, 0xFF,0xFF,0xFF);
            this.time.delayedCall(500, () => this.scene.start('Title'));
        });
    }
}

class Title extends Phaser.Scene {
    constructor(){
        super("Title");
        this.muted = false;
    }

    init(data) {
        if (data.muted != undefined) {
            this.muted = data.muted; // get if scene should be muted
        } else {
            this.muted = localStorage.getItem("muted") == "true" ? true : false;
        }
    }

    preload() {
        this.cameras.main.setZoom(.001);
        this.load.path = "assets/";
        this.load.image("board", "board.png");
        // background
        this.load.image("back", "background.png");

        this.load.image("title", "title.png");
    }

    create() {
        this.back = this.add.image(game.canvas.width/2, game.canvas.height/2, "back").setOrigin(0.5,0.5).setScale(3);

        // mute button
        this.muteButton = new MuteButton(this, 100, game.canvas.height - 100, () => {
            if (this.muted) {
                Tone.Transport.start();
                this.muted = false;
            } else {
                Tone.Transport.stop();
                this.muted = true;
            }
        })

        // create a new text object
        let titleText = this.add.image(1920/2, 220, 'title').setOrigin(.5, .5).setScale(2);

        let play = new Button(this, game.config.width/2 - 400, game.config.height/2,
        "PLAY", () => {
            this.seq1.dispose();
            this.seq2.dispose();
            this.seq3.dispose();
            this.scene.start("RunnerLevel", {muted: this.muted});
        }, 2);
        
        let clear = new Button(this, game.config.width/2 - 400, game.config.height/2 + 200,
            "RESET LEVEL", () => {
                localStorage.clear();
                clear.text.setText("COMPLETE");
                this.time.delayedCall(2000, () => {
                    clear.text.setText("RESET LEVEL");
                })
            }, 2);
        
        let full = new Button(this, game.config.width/2 - 400, game.config.height/2 + 400,
        "FULL SCREEN", () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        }, 2);

        let authors1 = this.add.text(game.config.width * 0.6, game.config.height * 0.45,
        "CREATED BY:",
        {
            font:"70px Arial",
            color: "#FFFFFF",
        }).setOrigin(0, 0.5);

        let authors2 = this.add.text(game.config.width * 0.6, game.config.height * 0.6,
            "Production Lead:\n     Joost (Will) Vonk",
            {
                font:"50px Arial",
                color: "#FFFFFF",
            }).setOrigin(0, 0.5);

        let authors3 = this.add.text(game.config.width * 0.6, game.config.height * 0.73,
            "Programming Lead:\n     Anthony Umemoto",
            {
                font:"50px Arial",
                color: "#FFFFFF",
            }).setOrigin(0, 0.5);
        
        let authors4 = this.add.text(game.config.width * 0.6, game.config.height * 0.86,
            "Testing/Art Lead:\n     Aaron Bruno",
            {
                font:"50px Arial",
                color: "#FFFFFF",
            }).setOrigin(0, 0.5);

        this.cameras.main.shake(1500, new Phaser.Math.Vector2(0.005, 0.02), false, (camera, progress) => {
            if (progress == 1) this.cameras.main.flash();
        });
        this.cameras.main.zoomTo(1, 3000, 'Back.easeOut', false, (camera, progress) => {
            if (progress == 1) {
                this.tweens.add({
                    targets: titleText,
                    scale: '*=' + 1.2,
                    yoyo: true,
                    duration: 500,
                    repeat: -1,
                    ease: 'Sine.inOut'
                })
                play.image.setAlpha(1);
                clear.image.setAlpha(1);
                full.image.setAlpha(1);
            }
        });

        Tone.Transport.stop();
        Tone.Transport.cancel();
        synth1 = new Tone.Synth().toDestination();
        synth2 = new Tone.Synth().toDestination();
        synth3 = new Tone.Synth().toDestination();
        synth2.volume.value = -16; 
        synth3.volume.value = -16;
        Tone.Transport.bpm.value = 220;
        this.seq1 = new Tone.Sequence((time, note) => {
            synth1.triggerAttackRelease(note, 0.1, time);
        }, ["C2",,,"C2","G2","G2","D#2",,,"D#2","F#2","F#2","C#2",,,"C#2"]).start(0);
        this.seq2 = new Tone.Sequence((time, note) => {
            synth2.triggerAttackRelease(note, 0.1, time);
        }, [,,"D#4","D#4",,"D#4","D#4",,"D#4",,,"D#4",,,"D#4",,,,"D#4","D#4",,"D#4","D#4",,"D#4",,,"D#4",,,"D4",,]).start("4m");
        this.seq3 = new Tone.Sequence((time, note) => {
            synth3.triggerAttackRelease(note, 0.1, time);
        }, [,,"G4","G4",,,"G4",,"G4",,,"G4",,,"G4",,,,"G4","G4",,,"G4",,"G4",,,"G#4",,,"F#4",,]).start("8m");
        if (!this.muted) Tone.Transport.start();
    }
}