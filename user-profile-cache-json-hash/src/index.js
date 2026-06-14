import express from 'express';
import Redis from 'ioredis';

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379"); // Connect to Redis server
app.post('/user/:id/json', async (req, res) => {
    await redis.set(`user:${req.params.id}`, JSON.stringify(req.body)); // Store user profile as JSON string

    res.json({ message: 'User profile cached successfully' });
});

app.get('/user/:id/json', async (req, res) => {
    const userProfile = await redis.get(`user:${req.params.id}`); // Retrieve user profile from Redis   

    if (!userProfile) {
        return res.status(404).json({ error: 'User profile not found' });
    }

    res.json(JSON.parse(userProfile)); // Return the user profile as JSON
});

app.post('/user/:id/hash', async (req, res) => {
    await redis.hset(`user:${req.params.id}`, req.body); // Store user profile as a hash   
    res.json({ message: 'User profile cached successfully' });
});


app.get('/user/:id/hash', async (req, res) => {
    const userProfile = await redis.hgetall(`user:${req.params.id}`); // Retrieve user profile from Redis as a hash 
    res.json(userProfile); // Return the user profile as JSON
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});