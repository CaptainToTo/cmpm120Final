// pause button and pause scene

class PauseButton {
    constructor(scene, x=100, y=100, size=100) {
        this.button = scene.add.text(x, y, "⏸️", { fontSize: size })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                scene.scene.pause();
                scene.scene.launch("Paused", {scene: scene});
            });
    }
}

class Paused extends Phaser.Scene {
    constructor() {
        super("Paused");
    }

    init(data) {
        this.origin = data.scene;
    }

    preload() {}

    create() {
        this.paused = this.add.text(game.config.width/2, game.config.height/2 - 200, "PAUSED",
            {
                font:"120px Arial",
                align: "center",
                color: "#0FD90E",
            }).setOrigin(0.5, 0.5);

        this.cont = new Button(this, game.config.width/2 - 400, game.config.height/2,
            "CONTINUE", () => {
                this.delete();
                this.scene.resume("RunnerLevel");
            });
        
        this.clear = new Button(this, game.config.width/2 - 400, game.config.height/2 + 200,
            "RESET", () => {
                this.delete();
                localStorage.clear();
                this.scene.start("Loading");
            });
        
        this.home = new Button(this, game.config.width/2 + 400, game.config.height/2,
            "HOME", () => {
                this.delete();
                this.origin.home = true;
                this.scene.resume("RunnerLevel");
            });
        
        this.full = new Button(this, game.config.width/2 + 400, game.config.height/2 + 200,
        "FULL SCREEN", () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });
    }

    delete() {
        this.paused.destroy();
        if (this.cont != undefined) this.cont.destroy();
        if (this.clear != undefined) this.clear.destroy();
        if (this.home != undefined) this.home.destroy();
        if (this.full != undefined) this.full.destroy();
    }
}

// intermediate loading scene in between gameover/pause and restart runner scene
class Loading extends Phaser.Scene {
    constructor() {
        super("Loading");
    }

    create() {
        this.scene.start("RunnerLevel");
    }
}

// intermediate loading scene in between gameover/pause and restart runner scene
class BackHome extends Phaser.Scene {
    constructor() {
        super("BackHome");
    }

    create() {
        this.scene.start("Title");
    }
}