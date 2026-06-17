import { Queue } from "bullmq"

const connection = {
    host: "localhost",
    port: 6379
}

const emailQueue = new Queue("emaill", { connection })

module.exports = {
    emailQueue,
    connection
}