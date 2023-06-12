class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }
    init(data) {
        this.cart = data.cart;
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
        this.coords = this.cart.destroy();
        game.renderer.snapshot(image => {
            if (this.textures.exists("cap")) this.textures.remove("cap");
            this.textures.addImage("cap", image);
            this.f();
        }, "image/jpeg")
    }

    f() {
        this.graphics = this.add.tileSprite(1920, 0, 1920 * 8, 1080, "cap").setOrigin(1, 0);
        this.beg = this.add.image(-1920 * 8, 0, "beg").setOrigin(0, 0);
        this.cart = this.add.sprite(this.coords.cart.x, this.coords.cart.y, "minecart").setOrigin(0.5, 1).setAngle(this.coords.cart.angle);
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
                    x: 1920/2 + this.coords.w,
                    y: 1080/2 + this.coords.h,
                    angle: 0,
                    ease: 'Sine.Out',
                    duration: 2000,
                },
            },
            {
                at: 2500,
                tween: {
                    targets: this.backWheel,
                    x: 1920/2 - this.coords.w,
                    y: 1080/2 + this.coords.h,
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
}