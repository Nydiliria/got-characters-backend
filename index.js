import express from "express";
import mongoose from "mongoose";
import characterRoutes from "./app/routes/characters.js";

const app = express();

/* CORS + OPTIONS */
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

/* Accept header: JSON only */
app.use((req, res, next) => {
    const accept = req.headers.accept;
    if (accept && !accept.includes("application/json")) {
        return res.status(406).json({message: "Only application/json is supported"});
    }
    next();
});

/* Body parser */
app.use(express.json());

/* Routes */
app.use("/characters", characterRoutes);

/* MongoDB + server */
const startServer = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/got");
        console.log("MongoDB connected");

        app.listen(8000, () => {
            console.log("Server running on port 8000");
        });
    } catch (err) {
        console.error("Database connection failed", err);
    }
};

startServer();
