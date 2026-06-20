import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const publicer = new Redis(process.env.REDIS_URL || "redis://localhost:6379");



app.post("/notification", async (req, res) => {

    const payload = {
        title: req.body.title,
    }

    const reciver = await publicer.publish('notification', JSON.stringify(payload))

    res.json({ msg: "Send to " + reciver })

})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 