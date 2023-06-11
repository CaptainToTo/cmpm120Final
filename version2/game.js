const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    backgroundColor: 0x0000ff,
    scene: [RunnerLevel, PlayerDebug, ],
    powerPerformance: "high-performance",
    title: "Runner",
    physics: {
        default: "matter",
        matter: {
            debug: true
        }
    }
});