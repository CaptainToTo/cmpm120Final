# cmpm120Final

## Deployed Link: https://captaintoto.github.io/cmpm120Final/

## Roles:

### Production Lead: Joost "Will" Vonk

### Programming Lead: Anthony Umemoto

### Testing Lead: Aaron Bruno

## Theme: Nearby in Space, Distant in Time

## Issues:

- After about 30 "game over"s, collision stops working and the player repeatedly falls through the ground. Refreshing the page will fix this bug.

- The jump pad will occasionally not jump the player into the air if the front half of the hitbox isn't touched.

- After some time, the stored level data can become corrupted, resulting in some placed objects not loading correctly.

## Sources:

### seedrandom.js by davidbau: https://github.com/davidbau/seedrandom
Used for random number generator with seeding to create the same level layout for repeat playthroughs.