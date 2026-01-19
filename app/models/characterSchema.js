import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
    name: {type: String,},
    house: {type: String,},
    titles: {type: String,},
});

const Character = mongoose.model("Character", characterSchema);

export default Character;