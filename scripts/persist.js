// Loader requires 2 things to work with any class:
//   1. A specific maker that is a standalone function, which creates an instance of a class
//           using a provided json object, and phaser scene.
//   2. A JSON() method within the class, which truncates the instance into a json object
//           containing the needed data to save.


// general maker class that is used to call specific makers for different object types
class Maker {
    constructor(scene) {
        this.scene = scene; // scene objects will be made in

        // map of specific makers, *****ADD SPECIFIC MAKERS HERE*****
        this.makers = {
            Placeable: PlaceableMaker
        }
    }

    // return the instance of the object created by the specific maker
    // all specific makers take the scene the object will be created in, and the jsonObj that will be parsed
    Make(jsonObj) {
        return this.makers[jsonObj.objectType](this.scene, jsonObj);
    }
}

// ===================================================================

// Object loader that loads objects from and to local storage as needed
// a Loader instance will be attached to the phaser scene it is loading and storing from
class Loader {
    constructor(scene) { // the scene this loader is attached to
        this.maker = new Maker(scene); // the general maker object that will return generated object instances
    }

    // try to load an object from local storage
    // return the instance of the object loaded, or null if no object is at that key
    Load(key) {
        const jsonString = localStorage.getItem(String(key)); // get object from storage as serialized string
        if (jsonString == null) return null; // return null if no object exists at that key

        const jsonObj = JSON.parse(jsonString); // parse string into json object

        return this.maker.Make(jsonObj); // return the instance that the maker makes
    }

    // save object in local storage at key
    Save(key, object) {
        const jsonObj = object.JSON(); // object JSON() method returns json object of attributes that should be saved
        localStorage.setItem(String(key), JSON.stringify(jsonObj)); // store object
    }
}