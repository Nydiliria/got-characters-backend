import express from "express";
import Character from "../models/characterSchema.js";

const router = express.Router();

/* OPTIONS collection */
router.options("/", (req, res) => {
    res.setHeader("Allow", "GET,POST,OPTIONS");
    res.sendStatus(204);
});

/* GET collection */
router.get("/", async (req, res) => {
    try {
        const characters = await Character.find({}, "name house");
        res.json(characters);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

/* POST new character */
router.post("/", async (req, res) => {
    console.log("Received body:", req.body);
    const {name, house, title} = req.body;

    if (!name || !house || !title) {
        return res.status(400).json({message: "All fields are required"});
    }

    try {
        const character = new Character({name, house, title});
        const savedCharacter = await character.save();
        res.status(201).json(savedCharacter);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

/* OPTIONS detail */
router.options("/:id", (req, res) => {
    res.setHeader("Allow", "GET,PUT,DELETE,OPTIONS");
    res.sendStatus(204);
});

/* GET detail */
router.get("/:id", async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);
        if (!character) {
            return res.status(404).json({message: "Character not found"});
        }
        res.json(character);
    } catch {
        res.status(404).json({message: "Character not found"});
    }
});

/* PUT detail */
router.put("/:id", async (req, res) => {
    const {name, house, title} = req.body;

    if (!name || !house || !title) {
        return res.status(400).json({message: "All fields are required"});
    }

    try {
        const updated = await Character.findByIdAndUpdate(
            req.params.id,
            {name, house, title},
            {new: true, runValidators: true}
        );

        if (!updated) {
            return res.status(404).json({message: "Character not found"});
        }

        res.json(updated);
    } catch {
        res.status(404).json({message: "Character not found"});
    }
});

/* DELETE detail */
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Character.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({message: "Character not found"});
        }
        res.json({message: "Character deleted"});
    } catch {
        res.status(404).json({message: "Character not found"});
    }
});

export default router;
