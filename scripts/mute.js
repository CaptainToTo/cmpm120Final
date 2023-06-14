class MuteButton {
    constructor(scene, x, y, action) {
        this.scene = scene;
        this.button = scene.add.text(x, y, "🔇", {font: "100px"}).setOrigin(0.5, 0.5);
        this.originalScale = 1;
        this.muted = false;
        this.action = action
        
        this.button.setInteractive()
            .on('pointerover', () => {
                this.scene.tweens.add({
                    targets: this.button,
                    scale: this.originalScale + (this.originalScale * 0.1),
                    duration: 100
                })
            })
            .on('pointerout', () => {
                this.scene.tweens.add({
                    targets: this.button,
                    scale: this.originalScale,
                    duration: 100
                })
            })
            .on('pointerdown', () => {
                this.scene.tweens.add({
                    targets: this.button,
                    scale: this.originalScale,
                    duration: 100
                });
                synth5.volume.value = -8;
                synth5.triggerAttackRelease("F3", "32n");
            })
            .on('pointerup', () => {
                this.scene.tweens.add({
                    targets: this.button,
                    scale: this.originalScale + (this.originalScale * 0.1),
                    delay: 100,
                    duration: 100
                });
                synth5.volume.value = -8;
                synth5.triggerAttackRelease("F4", "16n");
                this.action();
                localStorage.setItem("muted", String(this.scene.muted));
            });
    }

    destroy() {
        this.button.destroy();
    }
}