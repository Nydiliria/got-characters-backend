import express from "express";
import Character from "../models/characterSchema.js";

const router = express.Router();

// GET all characters
router.get("/", async (req, res) => {
    try {
        const characters = await Character.find();
        res.json(characters);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// POST a new character
router.post("/", async (req, res) => {
    const character = new Character({
        name: req.body.name,
        house: req.body.house,
        titles: req.body.titles,
    });

    try {
        const newCharacter = await character.save();
        res.status(201).json(newCharacter);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

export default router;
