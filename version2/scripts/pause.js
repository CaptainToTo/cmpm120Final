// pause button and pause scene

class PauseButton {
    constructor(scene, x=100, y=100, size=100) {
        this.button = scene.add.text(x, y, "⏸️", { fontSize: size })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                scene.scene.pause();
                scene.scene.launch("Paused");
            });
    }
}

class Paused extends Phaser.Scene {
    constructor() {
        super("Paused");
    }

    preload() {}

    create() {
        this.paused = this.add.text(game.config.width/2, game.config.height/2 - 200, "PAUSED",
            {
                font:"120px Arial",
                align: "center",
                color: "#0FD90E",
            }).setOrigin(0.5, 0.5);

        this.cont = new Button(this, game.config.width/2, game.config.height/2,
            "CONTINUE", () => {
                this.delete();
                this.scene.resume("RunnerLevel");
            });
        
        this.clear = new Button(this, game.config.width/2, game.config.height/2 + 200,
            "RESET", () => {
                this.delete();
                localStorage.clear();
                this.scene.start("Loading");
            });
        
        this.full = new Button(this, game.config.width/2, game.config.height/2 + 400,
        "FULL SCREEN", () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });
    }

    delete() {
        this.paused.destroy();
        if (this.cont != undefined) this.cont.destroy();
        if (this.clear != undefined) this.clear.destroy();
        if (this.full != undefined) this.full.destroy();
    }
}

class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }
    init(data) {
        this.coords = data.coords;
        this.capture = data.capture;
    }
    preload() {
        this.load.path = "assets/";
        this.load.image('gp', "gameplay.png");
        this.load.image('beg', 'beginning.jpeg');
        this.load.image("minecart", "minecart.png");
        this.load.image("wheel", "wheel.png");
        // this.cameras.main.setZoom(1);
    }

    create() {
        debugger;
        if (this.capture == null) {
            this.placeholderGP = this.add.image(0, 0, 'gp').setOrigin(0, 0);
            game.renderer.snapshot(image => {
                this.textures.addImage("cap", image);
                this.f();
            }, "image/jpeg")
        } else {
            this.textures.addImage("cap", this.capture)
            this.f();
        }
        this.input.keyboard.on('keydown-S', () => {
            this.scene.start('title');
        });
    }

    f() {
        this.graphics = this.add.tileSprite(this.w, 0, this.w * 8, this.h, "cap").setOrigin(1, 0);
        this.beg = this.add.image(-this.w * 8, 0, "beg").setOrigin(0, 0);
        this.cart = this.add.sprite(this.coords.cart.x, this.coords.cart.y, "minecart").setOrigin(0.5, 1);
        this.frontWheel = this.add.sprite(this.coords.frontWheel.x, this.coords.frontWheel.y, "wheel");
        this.backWheel = this.add.sprite(this.coords.backWheel.x, this.coords.backWheel.y, "wheel");

        const timeline = this.add.timeline([
            {
                at: 100,
                tween: {
                    targets: this.cart,
                    y: `-=${500}`,
                    x: `-=${100}`,
                    angle: 200,
                    ease: 'Sine',
                    duration: 2000,
                }
            },
            {
                at: 100,
                tween: {
                    targets: this.frontWheel,
                    y: `-=${200}`,
                    x: `+=${200}`,
                    angle: 400,
                    ease: 'Sine',
                    duration: 2000,
                }
            },
            {
                at: 100,
                tween: {
                    targets: this.backWheel,
                    y: `-=${173}`,
                    x: `-=${230}`,
                    angle: 400,
                    ease: 'Sine',
                    duration: 2000,
                }
            },
            {
                at: 2500,
                tween: {
                    targets: [this.graphics, this.beg],
                    x: `+=${this.w * 8}`,
                    duration: 2000,
                    ease: 'Sine.inOut'
                },
            },
            {
                at: 2500,
                tween: {
                    targets: this.cart,
                    x: this.w/2,
                    y: this.h/2,
                    angle: 0,
                    ease: 'Sine.Out',
                    duration: 2000,
                },
            },
            {
                at: 2500,
                tween: {
                    targets: this.frontWheel,
                    x: this.w/2 + this.coords.w,
                    y: this.h/2 + this.coords.h,
                    angle: 0,
                    ease: 'Sine.Out',
                    duration: 2000,
                },
            },
            {
                at: 2500,
                tween: {
                    targets: this.backWheel,
                    x: this.w/2 - this.coords.w,
                    y: this.h/2 + this.coords.h,
                    angle: 0,
                    ease: 'Sine.Out',
                    duration: 2000,
                },
            },
            {
                at: 4500,
                run: () => {this.scene.start("RunnerLevel")}
            }
            
        ]);
        timeline.play();
    }

    // preload() {}

    // create() {
    //     let paused = this.add.text(game.config.width/2, game.config.height/2 - 150, "GAME OVER",
    //         {
    //             font:"120px Arial",
    //             align: "center",
    //             color: "#EF2F09",
    //         }).setOrigin(0.5, 0.5);

    //     let cont = new Button(this, game.config.width/2, game.config.height/2 + 100,
    //         "RESTART", () => {
    //             paused.destroy();
    //             cont.destroy();
    //             this.scene.start("Loading");
    //         });
    // }
}

// intermediate loading scene in between gameover/pause and restart runner scene
class Loading extends Phaser.Scene {
    constructor() {
        super("Loading");
    }

    create() {
        this.scene.start("RunnerLevel");
    }
}