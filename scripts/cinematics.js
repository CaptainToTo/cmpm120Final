class Title extends Phaser.Scene {
    constructor(){
        super("title");
    }

    preload() {
        console.log('Cinematic loaded');
    }

    create() {
        // create a new text object
        let bg = this.add.rectangle (1920/2, 1080/2, 1920, 1080, "0x005b37")
        let titleText = this.add.text(700, 450, 'ChronoCart', {
            fontSize: 120,
            color: '#dd571c'
        });

        // create a tween to move the text from left to right
        this.cameras.main.zoomTo(1, 3000, 'Back.easeOut', false, (camera, progress) => this.cameras.main.setTintFill());
        this.cameras.main.shake(1500, new Phaser.Math.Vector2(0.005, 0.02));
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