let synth1 = new Tone.Synth().toDestination()
let synth2 = new Tone.Synth().toDestination();
let synth3 = new Tone.Synth().toDestination();
let synth4 = new Tone.Synth().toDestination();
let synth5 = new Tone.Synth().toDestination();
let noisy = new Tone.NoiseSynth().toDestination();
noisy.volume.value = -8
let plucky = new Tone.PluckSynth().toDestination();
let gainNode = new Tone.Gain(0).toDestination();
let osc = new Tone.Oscillator().connect(gainNode).start();

const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    backgroundColor: 0x000000,
    scene: [Start, Title, RunnerLevel, Paused, GameOver, Loading, BackHome],
    powerPerformance: "high-performance",
    title: "Runner",
    physics: {
        default: "matter",
        //matter: {
        //    debug: true
        //}
    }
});