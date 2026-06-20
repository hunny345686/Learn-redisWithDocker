import Redis from "ioredis";

const subs = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

subs.subscribe('notification', (err, count) => {
    if (err) {
        console.log(err, "Error in Subs");
        return
    }
    console.log("Subs Success")
})

subs.on('message', (channel, msg) => {

    console.log("Recived On ", channel, JSON.parse(msg))
})