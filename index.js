import mongoose from "mongoose";
import express from "express";
import characterRoutes from "./app/routes/characters.js";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/characters", characterRoutes);

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});

try {
    await mongoose.connect("mongodb://localhost:27017/");
} catch (e) {
    console.log("Database connection failed");
}
