import express from "express";
import Character from "../models/characterSchema.js";

console.log("📦 characters router loaded");

const router = express.Router();

/* OPTIONS collection */
router.options("/", (req, res) => {
    console.log("🧭 OPTIONS /characters");
    res.setHeader("Allow", "GET,POST,OPTIONS");
    res.sendStatus(204);
});

/* GET collection */
router.get("/", async (req, res) => {
    console.log("📥 GET /characters");
    try {
        const characters = await Character.find({}, "name house");
        res.json(characters);
    } catch (err) {
        console.error("🔥 GET collection failed", err);
        res.status(500).json({message: err.message});
    }
});

/* POST new character */
router.post("/", async (req, res) => {
    console.log("🔥 POST /characters HIT");
    console.log("📦 Request body:", req.body);

    const {name, house, title} = req.body;

    if (!name || !house || !title) {
        console.log("❌ Validation failed: missing fields");
        return res.status(400).json({message: "All fields are required"});
    }

    try {
        const character = new Character({name, house, title});
        console.log("🧩 Mongoose document created:", character);

        const savedCharacter = await character.save();
        console.log("✅ Saved to MongoDB:", savedCharacter);

        res.status(201).json(savedCharacter);
    } catch (err) {
        console.error("🔥 Save failed:", err);
        res.status(400).json({message: err.message});
    }
});

/* OPTIONS detail */
router.options("/:id", (req, res) => {
    console.log("🧭 OPTIONS /characters/:id");
    res.setHeader("Allow", "GET,PUT,DELETE,OPTIONS");
    res.sendStatus(204);
});

/* GET detail */
router.get("/:id", async (req, res) => {
    console.log("📥 GET /characters/:id", req.params.id);
    try {
        const character = await Character.findById(req.params.id);
        if (!character) {
            console.log("❌ Character not found");
            return res.status(404).json({message: "Character not found"});
        }
        res.json(character);
    } catch {
        console.log("❌ Invalid ID format");
        res.status(404).json({message: "Character not found"});
    }
});

/* PUT detail */
router.put("/:id", async (req, res) => {
    console.log("✏️ PUT /characters/:id", req.params.id);
    console.log("📦 Request body:", req.body);

    const {name, house, title} = req.body;

    if (!name || !house || !title) {
        console.log("❌ Validation failed");
        return res.status(400).json({message: "All fields are required"});
    }

    try {
        const updated = await Character.findByIdAndUpdate(
            req.params.id,
            {name, house, title},
            {new: true, runValidators: true}
        );

        if (!updated) {
            console.log("❌ Character not found");
            return res.status(404).json({message: "Character not found"});
        }

        console.log("✅ Character updated:", updated);
        res.json(updated);
    } catch (err) {
        console.error("🔥 Update failed", err);
        res.status(404).json({message: "Character not found"});
    }
});

/* DELETE detail */
router.delete("/:id", async (req, res) => {
    console.log("🗑 DELETE /characters/:id", req.params.id);
    try {
        const deleted = await Character.findByIdAndDelete(req.params.id);
        if (!deleted) {
            console.log("❌ Character not found");
            return res.status(404).json({message: "Character not found"});
        }
        console.log("✅ Character deleted");
        res.json({message: "Character deleted"});
    } catch {
        console.log("❌ Delete failed");
        res.status(404).json({message: "Character not found"});
    }
});

export default router;
