class Title extends Phaser.Scene {
    constructor() {
        super("title");
    }

    preload() {
        console.log('Sceneflow loaded');
    }

    create() {
        // create a new text object
        let bg = this.add.rectangle(1920 / 2, 1080 / 2, 1920, 1080, "0x005b37")
        let titleText = this.add.text(650, 450, 'ChronoCart', {
            fontSize: 120,
            color: '#ffd986'
        });

        let newGame = this.add.text(400, 550, "<New Game>", { fontSize: 100 })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start("gameplay")
            });

        let continueGame = this.add.text(200, 800, "<Continue>", { fontSize: 100 })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start("gameplay")
            });

        let settings = this.add.text(300, 700, "<Settings>", { fontSize: 100 })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.pause();
                this.scene.launch('settings', {return: "title"});
            });

        let credits = this.add.text(1000, 700, "<Credits>", { fontSize: 100 })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.pause();
                this.scene.launch('credits');
            });
    }
}

class Gameplay extends Phaser.Scene {
    constructor() {
        super("gameplay")
    }

    preload() {
        this.load.path = "assets/";
        this.load.image('gp', "gameplay.png");
    }

    create() {
        let bg = this.add.image(1920 / 2, 1080 / 2, "gp");
        let pauseButton = this.add.text(100, 100, "⏸️", { fontSize: 100 })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.pause();
                this.scene.launch('pause');
            });
    }
}

class Pause extends Phaser.Scene {
    constructor() {
        super('pause');
    }
    create() {
        let bg = this.add.rectangle(1920 / 2, 1080 / 2, 1500, 600, "0x000000")
            .setAlpha(.5);

        let back = this.add.text(400, 350, "<Back to Title>", { fontSize: 100 })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.stop("gameplay");
                this.scene.start("title")
            });

        let continueGame = this.add.text(200, 600, "<Resume>", { fontSize: 100 })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.resume("gameplay");
                this.scene.stop();
            });

        let settings = this.add.text(300, 500, "<Settings>", { fontSize: 100 })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.launch("settings", {return: "pause"})
                this.scene.stop();
            });
    }
}

class Settings extends Phaser.Scene {
    constructor() {
        super('settings');
    }
    init(data) {
        this.return = data.return;
    }

    create() {
        let bg = this.add.rectangle(1920 / 2, 1080 / 2, 1500, 600, "0x00FF00");
        let fs = this.add.text(300, 500, "<Toggle Fullscreen>", { fontSize: 100 })
        let back = this.add.text(400, 350, "<Back>", { fontSize: 100 })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                console.log(this.return);
                if (this.return == "pause") {
                    this.scene.launch("pause");
                } else if (this.return == "title") {
                    this.scene.resume("title");
                }
                this.scene.stop();
            });
    }
}

class Credits extends Phaser.Scene {
    constructor() {
        super('credits');
    }

    create() {
        let bg = this.add.rectangle(1920 / 2, 1080 / 2, 1920, 1080, "0x222222");
        let fs = this.add.text(300, 500, "Aaron\nJoost\nTony", { fontSize: 100 })
        let back = this.add.text(400, 350, "<Back>", { fontSize: 100 })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start("title");
            });
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
    scene: [Title, Gameplay, Pause, Settings, Credits]
}

let game = new Phaser.Game(config);