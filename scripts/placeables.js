// root Placeable class inherited by all classes describing placable objects
// generated by conveyer belt

// root class describes basics animations and behaviors

class Placeable {
    constructor(scene, x, y, sprite, belt, stretch=2) {
        this.sprite = scene.add.sprite(x, y, sprite).setOrigin(0.5, 0.5);
        this.source = sprite; // the source image string
        this.scene = scene;

        this.objectType = "Placeable"; // sub classes will replace this string with their own unique type

        this.belt = belt; // reference to the belt object to remove self from belt list 
        this.bound = belt.sprite.y + (belt.sprite.height / 2);  // dead zone for placing object, if object is still on conveyer belt do not drop

        this.originalScale = 1; // original scale for keeping animations consistent
        this.stretch = stretch; // scale to change to when object is placed

        this.placed = false;    // tracks if object has been placed
        this.grabbed = false;   // player is currently placing object
        this.saved = false;     // if object was placed in a previous run, previous duplicate saves

        // on interaction animations
        let self = this;
        this.sprite.setInteractive()
            .on("pointerover", () => { // stretch when hovered over
                if (!self.placed && !self.grabbed) {
                    scene.tweens.add({
                        targets: self.sprite,
                        scale: self.originalScale + (self.originalScale * 0.1),
                        duration: 150
                    })
                }
            })
            .on("pointerout", () => { // shrink back to original size when mouse is taken off
                if (!self.placed) {
                    scene.tweens.add({
                        targets: self.sprite,
                        scale: self.originalScale,
                        duration: 150
                    })
                }
            })
            .on("pointerdown", () => { // pickup and follow
                if (!self.placed) {
                    self.grabbed = true;
                }
            })
            .on("pointerup", () => { // drop object
                if (!self.placed) {
                    self.grabbed = false;
                    if (self.sprite.y > self.bound) {
                        self.Place(); // add physics
                    } else {
                        belt.fixPosition(self); // fix position, put back in order on conveyer belt
                    }
                }
            });
        
        // if object is grabbed, follow mouse
        scene.input.on('pointermove', function(pointer) {
            if (self.grabbed) {
                self.sprite.x = pointer.x;
                self.sprite.y = pointer.y;
            }
        });
    }

    // drop object into physics
    Place() {
        this.placed = true;

        this.belt.removeObject(this); // remove from conveyer belt
        this.scene.matter.add.gameObject(this.sprite); // add sprite to physics
        this.scene.placed.push(this); // add self to scene's list of placed objects

        // animate stretch
        this.scene.tweens.add({
            targets: this.sprite,
            scale: this.stretch,
            duration: 200
        });

        this.scene.time.delayedCall(200, this.setScale(this.stretch));
    }

    // changes sprite scale and originalScale
    setScale(scale) {
        this.sprite.setScale(scale);
        this.originalScale = scale;
    }

    // returns a json object version of the placeable instance
    JSON() {
        const obj = {
            objectType: this.objectType,
            sprite: this.source,
            y: this.sprite.y,
            rotation: this.sprite.rotation
        };

        return obj;
    }
}

// specific maker for
function PlaceableMaker(scene, jsonObj) {
    let obj = new Placeable(scene, scene.objSpawn, jsonObj.y, jsonObj.sprite, scene.belt);
    obj.Place();
    obj.sprite.body.isStatic = true;
    obj.sprite.rotation = jsonObj.rotation;
    obj.saved = true;

    return obj;
}