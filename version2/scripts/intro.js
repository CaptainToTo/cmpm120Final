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
                this.scene.start("RunnerLevel");
            })
        
        let reset = this.add.text(game.canvas.width/2, 2300, '<Reset>', {fontSize: 120})
            .setAlpha(0)
            .setInteractive()
            .on('pointerdown', () => {
                reset.setTint("#888888");
            })
            .on('pointerup', () => {
                reset.clearTint();
                localStorage.clear();
            })
            .setOrigin(0.5, 0.5);

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