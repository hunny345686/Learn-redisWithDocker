import express from 'express';
import redis from 'ioredis';


const app = express();
app.use(express.json());
const redisClient = new redis(process.env.REDIS_URL || 'redis://localhost:6379');

function otpKey(phone) {
    return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redisClient.setex(otpKey(phone), 30, otp); // opt valid for 30 seconds
    res.json({ message: 'OTP sent', otp: otp, phone: phone });
});

app.post("/otp/verify", async (req, res) => {
    const { phone, otp } = req.body;
    const storedOtp = await redisClient.get(otpKey(phone));
    if (!storedOtp) {
        return res.status(400).json({ message: 'OTP expired or not found' });
    }
    if (storedOtp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
    await redisClient.del(otpKey(phone)); // OTP is used, delete it
    res.json({ message: 'OTP verified successfully' });
});

app.get("/otp/:phone/ttl", async (req, res) => {
    const { phone } = req.params;
    const ttl = await redisClient.ttl(otpKey(phone));
    res.json({ phone, ttl });
});

app.listen(4000, () => {
    console.log(`server is running on port http://localhost:4000`);

});
