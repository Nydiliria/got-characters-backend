import express from "express";
import mongoose from "mongoose";
import characterRoutes from "./app/routes/characters.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/got";
const PORT = process.env.EXPRESS_PORT || 8001;

const app = express();

/* REQUESTS */
app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});

/* CORS */
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

/* ACCEPT HEADER CHECK */
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }

    const accept = req.headers.accept || "";
    if (
        accept.includes("application/json") ||
        accept.includes("*/*")
    ) {
        next();
    } else {
        res.status(406).json({
            message: "Only application/json is supported"
        });
    }
});

app.use(express.json());

/* ROUTE */
app.use("/characters", characterRoutes);

/* ROOT */
app.get("/", (req, res) => {
    res.json({
        message: "Game of Thrones API",
        _links: {
            characters: {
                href: "http://145.24.237.137:8001/characters"
            }
        }
    });
});

/* START SERVER */
const startServer = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Database connection failed", err);
    }
};

startServer();
