import mongoose from "mongoose";
import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const BANNE_KAY = "app:banner"


app.post("/banner", async (req, res) => {
    const { banner } = req.body;
    if (!banner) {
        return res.status(400).json({ error: "Banner is required" });
    }
    await redis.set(BANNE_KAY, banner);
    res.json({ message: "Banner set successfully" });
});

app.get("/banner", async (req, res) => {
    const banner = await redis.get(BANNE_KAY);
    if (!banner) {
        return res.status(404).json({ error: "Banner not found" });
    }
    res.json({ banner });
});
app.delete("/banner", async (req, res) => {
    await redis.del(BANNE_KAY);
    res.json({ message: "Banner deleted successfully" });
});


app.get("/banner/exists", async (req, res) => {
    const exists = await redis.exists(BANNE_KAY);
    res.json({ exists: exists === 1 });
});


app.get("/redis", async (req, res) => {
    const reply = await redis.ping();
    res.json({ message: "Hello from Redis!", redisReply: reply });
});

app.get("/mongo", async (req, res) => {
    const url = process.env.MONGO_URL || "mongodb://localhost:27017/mongo_prem_db";

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(url);
    }
    res.json({ message: "Hello from MongoDB!", databaseName: mongoose.connection.name });

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 