import express from "express";
import Character from "../models/characterSchema.js";

const router = express.Router();
const BASE_URL = "http://145.24.237.137:8001";

/* OPTIONS COLLECTION */
router.options("/", (req, res) => {
    res.setHeader("Allow", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.sendStatus(204);
});

/* GET COLLECTION */
router.get("/", async (req, res) => {
    const characters = await Character.find({}, "name house");

    res.json({
        items: characters.map(c => ({
            id: c._id,
            name: c.name,
            house: c.house,
            _links: {
                self: {
                    href: `${BASE_URL}/characters/${c._id}`
                }
            }
        })),
        _links: {
            self: {
                href: `${BASE_URL}/characters`
            },
            collection: {
                href: `${BASE_URL}/characters`
            }
        }
    });
});

/* POST COLLECTION */
router.post("/", async (req, res) => {
    const {name, house, title} = req.body;

    if (!name || !house || !title) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const character = new Character({name, house, title});
    const saved = await character.save();

    res.status(201).json({
        id: saved._id,
        name: saved.name,
        house: saved.house,
        title: saved.title,
        _links: {
            self: {
                href: `${BASE_URL}/characters/${saved._id}`
            },
            collection: {
                href: `${BASE_URL}/characters`
            }
        }
    });
});

/* OPTIONS DETAIL */
router.options("/:id", (req, res) => {
    res.setHeader("Allow", "GET,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.sendStatus(204);
});

/* GET DETAIL */
router.get("/:id", async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);

        if (!character) {
            return res.status(404).json({
                message: "Character not found"
            });
        }

        res.json({
            id: character._id,
            name: character.name,
            house: character.house,
            title: character.title,
            _links: {
                self: {
                    href: `${BASE_URL}/characters/${character._id}`
                },
                collection: {
                    href: `${BASE_URL}/characters`
                }
            }
        });
    } catch {
        res.status(404).json({
            message: "Character not found"
        });
    }
});

/* PUT DETAIL */
router.put("/:id", async (req, res) => {
    const {name, house, title} = req.body;

    if (!name || !house || !title) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        const updated = await Character.findByIdAndUpdate(
            req.params.id,
            {name, house, title},
            {new: true, runValidators: true}
        );

        if (!updated) {
            return res.status(404).json({
                message: "Character not found"
            });
        }

        res.json({
            id: updated._id,
            name: updated.name,
            house: updated.house,
            title: updated.title,
            _links: {
                self: {
                    href: `${BASE_URL}/characters/${updated._id}`
                },
                collection: {
                    href: `${BASE_URL}/characters`
                }
            }
        });
    } catch {
        res.status(404).json({
            message: "Character not found"
        });
    }
});

/* DELETE DETAIL */
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Character.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: "Character not found"
            });
        }

        // CHECKER-COMPLIANT DELETE
        res.status(204).send();
    } catch {
        res.status(404).json({
            message: "Character not found"
        });
    }
});

export default router;
