// class containing conveyer belt.
// generates placeable objects in a list

// call belt Update() method within scene Update() method

class Belt {
    constructor(scene, x, y, max=10) {
        this.scale = 0.6;
        this.sprite = scene.add.sprite(x, y, "belt").setScale(this.scale);
        this.scene = scene;

        this.max = max; // maximum number of placeables on the belt at a time
        this.objects = []; // list containing the placeables on the belt
        
        // visual formatting for organizing objects on conveyer belt
        this.scaleWidth = (this.sprite.width * this.scale);
        this.spacing = 100; // space placed in between objects
        this.margin = this.sprite.x - (this.scaleWidth / 2) + 150; // stopping point for first object on belt in global space
        this.spawn = this.sprite.x + (this.scaleWidth / 2); // x coord where objects will be instantiated
        this.speed = 0.5;  // speed objects move at down the belt
    }

    // remove object from objects list
    removeObject(object) {
        const index = this.objects.indexOf(object);
        if (index != -1) {
            this.objects.splice(index, 1);
        }
    }

    // fix position of an object back to where it should be on the conveyer belt
    fixPosition(object) {
        const i = this.objects.indexOf(object);
        if (i != -1) {
            if (i == 0) { // if this is the 0th object
                this.objects[i].sprite.x = this.margin;
            } else {
                this.objects[i].sprite.x = this.objects[i - 1].sprite.x + (this.objects[i - 1].sprite.width / 2) + this.spacing;
            }
            this.objects[i].sprite.y = this.sprite.y;
        }
    }

    // call with scene update
    Update(DELTA) {

        // check if new objects should be added
        if (this.objects.length < this.max) {
            this.objects.push( // TODO: make random placeable subclass
                new Placeable(this.scene, this.spawn, this.sprite.y, "block", this)
            );
        }

        // move existing objects
        for (let i = 0; i < this.objects.length; i++) {
            // check if object is picked up
            if (this.objects[i].grabbed) break;

            // check if object is the first in the list
            if (i == 0) {
                if (this.objects[i].sprite.x > this.margin) { // if first object isn't at stopping point
                    this.objects[i].sprite.x -= this.speed * DELTA;
                }
            } else { // for all subsequent objects
                // if object[i].x > prev_obj.x + spacing
                if (this.objects[i].sprite.x > this.objects[i - 1].sprite.x + (this.objects[i - 1].sprite.width / 2) + this.spacing) {
                    this.objects[i].sprite.x -= this.speed * DELTA;
                }
            }
        }
    }
}