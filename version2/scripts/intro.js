class Title extends Phaser.Scene {
    constructor(){
        super("Title");
    }

    preload() {
        this.cameras.main.setZoom(.001);
    }

    create() {
        // create a new text object
        let bg = this.add.rectangle (1920/2, 1080/2, 1920, 1080, "0x005b37")
        let titleText = this.add.text(1920/2, 300, 'ChronoCart', {
            fontSize: 120,
            color: '#dd571c'
        }).setOrigin(.5, .5);

        let play = new Button(this, game.config.width/2, game.config.height/2,
        "PLAY", () => {
            this.scene.start("RunnerLevel");
        }, 2);
        
        let clear = new Button(this, game.config.width/2, game.config.height/2 + 200,
            "RESET LEVEL", () => {
                localStorage.clear();
                clear.text.setText("COMPLETE");
                this.time.delayedCall(2000, () => {
                    clear.text.setText("RESET LEVEL");
                })
            }, 2);
        
        let full = new Button(this, game.config.width/2, game.config.height/2 + 400,
        "FULL SCREEN", () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        }, 2);

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