import express from "express";
import mongoose from "mongoose";
import characterRoutes from "./app/routes/characters.js";

const app = express();

/* 🔍 GLOBAL REQUEST LOGGER */
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
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");

        app.listen(8000, () => {
            console.log("Server running on port 8000");
        });
    } catch (err) {
        console.error("Database connection failed", err);
    }
};

startServer();
