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
    }

    create() {
        this.base = game.config.height;
        this.width = game.config.width;
        this.start = this.width / 5

        this.coords = this.cart.destroy();
        this.cart = this.add.sprite(this.coords.cart.x, this.coords.cart.y, "minecart").setOrigin(0.5, 1).setAngle(this.coords.cart.angle);
        this.frontWheel = this.add.sprite(this.coords.frontWheel.x, this.coords.frontWheel.y, "wheel");
        this.backWheel = this.add.sprite(this.coords.backWheel.x, this.coords.backWheel.y, "wheel");
        const timeline1 = this.add.timeline([
            {
                at: 100,
                tween: {
                    targets: this.cart,
                    y: `-=${500}`,
                    x: `-=${100}`,
                    angle: 200,
                    alpha: 0,
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
                    alpha: 0,
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
                    alpha: 0,
                    ease: 'Sine',
                    duration: 2000,
                }
            },
            {
                at: 2500,
                run: () => {
                    game.renderer.snapshot(image => {
                        if (this.textures.exists("cap")) this.textures.remove("cap");
                        this.textures.addImage("cap", image);
                        this.f();
                    }, "image/jpeg")
                }
            }
        ]);
        timeline1.play();
    }

    f() {
        console.log(this.cart);
        this.graphics = this.add.tileSprite(this.width, 0, this.width * 8, this.base, "cap").setOrigin(1, 0);
        this.beg = this.add.image(-this.width * 8, 0, "beg").setOrigin(0, 0);
        this.children.sendToBack(this.graphics);
        this.children.sendToBack(this.beg);

        const timeline2 = this.add.timeline([
            {
                at: 100,
                tween: {
                    targets: [this.graphics, this.beg],
                    x: `+=${this.width * 8}`,
                    duration: 2000,
                    ease: 'Sine.inOut'
                },
            },
            {
                at: 100,
                tween: {
                    targets: this.cart,
                    x: this.start - this.coords.w,
                    y: this.base/2,
                    angle: 0,
                    alpha: 1,
                    ease: 'Sine.Out',
                    duration: 2000,
                },
            },
            {
                at: 100,
                tween: {
                    targets: this.frontWheel,
                    x: this.start,
                    y: this.base/2 + this.coords.h,
                    angle: 0,
                    alpha: 1,
                    ease: 'Sine.Out',
                    duration: 2000,
                },
            },
            {
                at: 100,
                tween: {
                    targets: this.backWheel,
                    x: this.start - 2 * this.coords.w,
                    y: this.base/2 + this.coords.h,
                    angle: 0,
                    alpha: 1,
                    ease: 'Sine.Out',
                    duration: 2000,
                },
            },
            {
                at: 2100,
                run: () => {this.scene.start("RunnerLevel")}
            }
            
        ]);
        timeline2.play();
    }
}