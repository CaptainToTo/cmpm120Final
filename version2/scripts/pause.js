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
                font:"100px Arial",
                align: "center",
                color: "#0FD90E",
            }).setOrigin(0.5, 0.5);

        this.cont = new Button(this, game.config.width/2, game.config.height/2,
            "CONTINUE", () => {
                this.delete();
                this.scene.resume("RunnerLevel");
            });
        
        this.clear = new Button(this, game.config.width/2, game.config.height/2 + 300,
            "RESET", () => {
                this.delete();
                localStorage.clear();
                this.scene.start("Loading");
            });
    }

    delete() {
        this.paused.destroy();
        if (this.cont != undefined) this.cont.destroy();
        if (this.clear != undefined) this.clear.destroy();
    }
}

class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    preload() {}

    create() {
        let paused = this.add.text(game.config.width/2, game.config.height/2 - 150, "GAME OVER",
            {
                font:"100px Arial",
                align: "center",
                color: "#EF2F09",
            }).setOrigin(0.5, 0.5);

        let cont = new Button(this, game.config.width/2, game.config.height/2 + 100,
            "RESTART", () => {
                paused.destroy();
                cont.destroy();
                this.scene.start("Loading");
            });
    }
}

class Loading extends Phaser.Scene {
    constructor() {
        super("Loading");
    }

    create() {
        this.scene.start("RunnerLevel");
    }
}