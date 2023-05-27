class Title extends Phaser.Scene {
    constructor(){
        super("title");
    }

    preload() {
        console.log('Sceneflow loaded');
    }

    create() {
        // create a new text object
        let titleText = this.add.text(-game.config.width, 250, 'Sceneflow...', {
            fontSize: 90,
            color: '#dd571c'
        });

        // create a tween to move the text from left to right
        this.tweens.add({
            targets: titleText,
            x: game.config.width / 2 - titleText.width / 2,
            ease: 'Power1',
            duration: 1000,
            delay: 1000
        });
    }
}

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    scene: [Title]
}

let game = new Phaser.Game(config);