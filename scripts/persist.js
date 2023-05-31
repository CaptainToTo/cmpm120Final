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
            Explodable: ExplodableMaker,
            Weatherable: WeatherableMaker,
            Bedrock: BedrockMaker,
            JumpPad: JumpPadMaker,
            Ramp: RampMaker,
            LoadList: LoadListMaker
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

// =====================================================================

// list containing load order for placeable objects, ordered by x coord
class LoadList {
    constructor(scene, prefix) {
        this.Loader = new Loader(scene);

        let jsonObj = this.Loader.Load(prefix + "List");
        

        this.scene = scene;
        this.prefix = prefix; // prefix added to storage keys
        this.list = []; // list of ints, where each int is the next load point for an object
        this.index = 0; // current next obj to be loaded
        if (jsonObj != null) { // if list already exists
            console.log("LoadList: ", jsonObj.list);
            this.list = jsonObj.list;

            for (; placeablesIDs < this.list.length;) {
                placeablesIDs++;
            }
        }
        
    }

    // check if the next element in the list should be loaded, returns the instance of that object
    Load(x) {
        if (this.list.length == 0) return null;
        if (this.index >= this.list.length) return null;
        if (x < this.list[this.index].x) return null; // return null if next object shouldn't be loaded yet

        let obj = this.Loader.Load(this.prefix + String(this.list[this.index].id));
        this.index += 1;
        return obj;
    }

    // sorts new element in list, assume inserted at back
    Sort() {
        if (this.list.length <= 1) return null;
        let i = this.list.length - 1;
        while(i > 0) {
            if (this.list[i].id == this.list[i - 1].id) {
                this.list[i - 1] = this.list[i];
                this.list.splice(i, 1);
                return i - 1;
            }

            if (this.list[i].x < this.list[i - 1].x) { // swap
                let temp = this.list[i];
                this.list[i] = this.list[i - 1];
                this.list[i - 1] = temp;
                i -= 1;
            } else {
                return i;
            }
        }
    }

    // insert a new item, and save it in local storage
    Insert(obj) {
        console.log(obj);
        // insert x coord
        this.list.push({
            id: obj.id,
            x: this.scene.progress - (this.scene.objSpawn - obj.sprite.x)
        });
        let i = this.Sort();
        if (i == null) i = 0;

        // save obj, and update list in storage
        this.Loader.Save(this.prefix + String(this.list[i].id), obj);
        this.Loader.Save(this.prefix + "List", this);

        this.index += 1;
    }

    // convert list to json object
    JSON() {
        const obj = {
            objectType: "LoadList",
            list: this.list
        };
        return obj;
    }
}

// LoadList specific maker, only used to fetch jsonObj in LoadList constructor
function LoadListMaker(scene, jsonObj) {
    return jsonObj;
}