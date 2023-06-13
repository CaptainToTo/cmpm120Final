// basic interactable class and a button that can be used for UI. Sprite is hard coded

class Interactable {
    constructor(scene, x, y, texture, action, scale=1.7, frame={}) {
        this.image = scene.add.image(x, y, texture, frame).setScale(scale ,0.7);
        this.scene = scene;
        this.action = action;
        this.originalScale = scale;

        this.image.setInteractive()
            .on('pointerover', () => {
                this.scene.tweens.add({
                    targets: this.image,
                    scaleX: this.originalScale + (this.originalScale * 0.1),
                    duration: 150
                })
            })
            .on('pointerout', () => {
                this.scene.tweens.add({
                    targets: this.image,
                    scaleX: this.originalScale,
                    duration: 150
                })
            })
            .on('pointerdown', () => {
                this.scene.tweens.add({
                    targets: this.image,
                    scaleX: this.originalScale - (this.originalScale * 0.05),
                    duration: 100
                });
            })
            .on('pointerup', () => {
                this.scene.tweens.add({
                    targets: this.image,
                    scaleX: this.originalScale,
                    delay: 100,
                    duration: 100
                });
                this.action()
            });
    }

    setScale(scale) {
        this.image.setScale(scale);
        this.originalScale = scale;
    }

    setTexture(texture) {
        this.image.setTexture(texture);
    }
}

class Button extends Interactable {
    constructor(scene, x, y, text, action) {
        super(scene, 0, 0, "board", action);
        this.text = scene.add.text(0, 0, text,
            {
                font:"70px Arial",
                align: "center",
                color: "#2AB9FF",
            }).setOrigin(0.5, 0.5);
        this.container = scene.add.container(x, y);
        this.container.add([this.image, this.text]);
    }

    destroy() {
        this.text.destroy();
        this.image.destroy();
        this.container.destroy();
    }
}