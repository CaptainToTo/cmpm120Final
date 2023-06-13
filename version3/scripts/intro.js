class Title extends Phaser.Scene {
    constructor(){
        super("Title");
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

        // create a new text object
        let titleText = this.add.image(1920/2, 220, 'title').setOrigin(.5, .5).setScale(2);

        let play = new Button(this, game.config.width/2 - 400, game.config.height/2,
        "PLAY", () => {
            this.scene.start("RunnerLevel");
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
            "Art Lead:\n     Aaron Bruno",
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
    }
}