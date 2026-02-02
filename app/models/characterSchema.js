import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    house: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
});

const Character = mongoose.model("Character", characterSchema);

export default Character;
