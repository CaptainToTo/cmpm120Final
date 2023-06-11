class Title extends Phaser.Scene {
    constructor(){
        super("title");
    }

    preload() {
        this.cameras.main.setZoom(.001);
    }

    create() {
        // create a new text object
        let bg = this.add.rectangle (1920/2, 1080/2, 1920, 1080, "0x005b37")
        let titleText = this.add.text(1920/2, 400, 'ChronoCart', {
            fontSize: 120,
            color: '#dd571c'
        }).setOrigin(.5, .5);

        let play = this.add.text(700, 1900, '<Play>', {fontSize: 120})
            .setAlpha(0)
            .setInteractive()
            .on('pointerdown', () => {
                play.setTint("#888888");
            })
            .on('pointerup', () => {
                play.clearTint();
            })

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
                play.setAlpha(1);
                this.tweens.add({
                    targets: play,
                    y: 550,
                    duration: 500
                })
            }
        });
        
        this.input.keyboard.on('keydown-S', () => {
            this.scene.start('crash', {cart: [1920 / 2, 600, 0, 80], capture: null});
        });
    }
    
}

class CrashCinematic extends Phaser.Scene {
    constructor(){
        super("crash");
    }
    init(data) {
        [this.x, this.y, this.h, this.w] = data.cart;
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
        this.graphics = this.add.tileSprite(1920, 0, 1920 * 8, 1080, "cap").setOrigin(1, 0);
        this.beg = this.add.image(-1920 * 8, 0, "beg").setOrigin(0, 0);
        this.cart = this.add.sprite(this.x, this.y, "minecart").setOrigin(0.5, 1);
        this.frontWheel = this.add.sprite(this.x + this.w, this.y + this.h, "wheel");
        this.backWheel = this.add.sprite(this.x - this.w, this.y + this.h, "wheel");

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
                    x: `+=${1920 * 8}`,
                    duration: 2000,
                    ease: 'Sine.inOut'
                },
            },
            {
                at: 2500,
                tween: {
                    targets: this.cart,
                    x: 1920/2,
                    y: 1080/2,
                    angle: 0,
                    ease: 'Sine.Out',
                    duration: 2000,
                },
            },
            {
                at: 2500,
                tween: {
                    targets: this.frontWheel,
                    x: 1920/2 + this.w,
                    y: 1080/2 + this.h,
                    angle: 0,
                    ease: 'Sine.Out',
                    duration: 2000,
                },
            },
            {
                at: 2500,
                tween: {
                    targets: this.backWheel,
                    x: 1920/2 - this.w,
                    y: 1080/2 + this.h,
                    angle: 0,
                    ease: 'Sine.Out',
                    duration: 2000,
                },
            },
            
        ]);
        timeline.play();
    }

}

let config = {
    type: Phaser.WEBGL,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    backgroundColor: 0x000000,
    scene: [Title, CrashCinematic]
}

let game = new Phaser.Game(config);