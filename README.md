# cmpm120Final: ChronoCart

## Deployed Link (access all versions): https://captaintoto.github.io/cmpm120Final/

## Complete Experience: https://captaintoto.github.io/cmpm120Final/version3/index.html

## Cinematic Prototype: https://captaintoto.github.io/cmpm120Final/version3/cinematics1.html

## Sceneflow Prototype: https://captaintoto.github.io/cmpm120Final/version3/sceneflow1.html

## Roles:

### Production Lead: Joost "Will" Vonk

### Programming Lead: Anthony Umemoto

### Testing/Art Lead: Aaron Bruno

## Theme: Nearby in Space, Distant in Time

ChronoCart has the player traversing the same level on repeated playthroughs. Any objects they place on the level also persist. So, each playthrough is distant in time, but shares the same space.

## Issues:

- After about 30 "game over"s, collision stops working and the player repeatedly falls through the ground. Refreshing the page will fix this bug.

- The jump pad will occasionally not jump the player into the air if the front half of the hitbox isn't touched.

- After some time, the stored level data can become corrupted, resulting in some placed objects not loading correctly. The game will still run, but the level has to be reset to fix this.

## Sources:

### seedrandom.js by davidbau: https://github.com/davidbau/seedrandom
Used for random number generator with seeding to create the same level layout for repeat playthroughs.

### Tone.js
Used to create procedural music.