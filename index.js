import express from "express";
import mongoose from "mongoose";
import characterRoutes from "./app/routes/characters.js";

// server side connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/got";
const PORT = process.env.EXPRESS_PORT || 8001;

const app = express();

/* GLOBAL REQUEST LOGGER */
app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});

/* CORS + OPTIONS */
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

    if (req.method === "OPTIONS") {
        console.log("OPTIONS request handled");
        return res.sendStatus(204);
    }
    next();
});

/* Accept header: JSON only */
app.use((req, res, next) => {
    const accept = req.headers.accept;

    if (
        accept &&
        !accept.includes("application/json") &&
        accept !== "*/*"
    ) {
        console.log("Rejecting non-JSON Accept header:", accept);
        return res.status(406).json({message: "Only application/json is supported"});
    }

    next();
});

/* Body parser */
app.use(express.json());

/* ROUTES */
app.use("/characters", characterRoutes);

/* ROOT TEST ROUTE */
app.get("/", (req, res) => {
    console.log("Root route hit");
    res.send("Hello World!");
});

/* MongoDB + server */
const startServer = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB connected at:", MONGODB_URI);

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Database connection failed", err);
    }
};

startServer();
