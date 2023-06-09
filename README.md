# cmpm120Final: ChronoCart

## [Complete Experience](https://atumemot.itch.io/chronocart)

## [Cinematic Prototype](https://captaintoto.github.io/cmpm120Final/prototypes/cinematicsPrototype/)

## [Sceneflow Prototype](https://captaintoto.github.io/cmpm120Final/prototypes/sceneFlowPrototype/)

## [Gameplay Prototype](https://captaintoto.github.io/cmpm120Final/prototypes/gameplayPrototype/)

## Roles:

### Production Lead: Joost "Will" Vonk

### Programming Lead: Anthony Umemoto

### Testing/Art Lead: Aaron Bruno

## Theme: Nearby in Space, Distant in Time

ChronoCart has the player traversing the same level on repeated playthroughs. Any objects they place on the level also persist. So, each playthrough is distant in time, but shares the same space.

## Requirements:

- **Project Archive**: this GitHub repo contains commit records for all progress made on the project.

- **Source Code**: All source code is located within this repo. External libraries we used have been cited below.

- **Mobile**: All interactions in the game can be done with touch gestures. The player can also toggle full screen.

- **Self-Teaching**: A short tutorial on the core gameplay loop is shown at the start of the level to explain how to play the game.

- **Persistent Music Toggle**: A mute button can be pressed in the home screen, and the pause menu to toggle sound. This setting persists between page refreshes.

- **Completability**: The only step to get the main game is the menu. The game is an endless runner, but the core gameplay loop can be understood in under 10 minutes.

- **Data Driven Experience Progression**: Data from the player's run of the level is saved as JSON in the browser's local storage. This data is fetched to rebuild the level on subsequent runs.

- **Procedural Audio**: All Background music and sound effects are generated using ToneJS.

- **Procedural Graphics**: The minecart is built from several moving parts using the matter physics engine. These parts dynamically move in relation to one another and the environment.

## Issues:

- After about 30 "game over"s, collision stops working and the player repeatedly falls through the ground. Refreshing the page will fix this bug.

- The jump pad will occasionally not jump the player into the air if the front half of the hitbox isn't touched.

- After some time, the stored level data can become corrupted, resulting in some placed objects not loading correctly. The game will still run, but the level has to be reset to fix this.

## Sources:

### Created with the Phaser.js Framework

### seedrandom.js by davidbau: https://github.com/davidbau/seedrandom
Used for random number generator with seeding to create the same level layout for repeat playthroughs.

### Tone.js
Used to create procedural music.