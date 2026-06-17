import { Worker } from "bullmq"
import { connection } from "./queue.js"

const emailWorker = new Worker("email",
    async (job) => {
        console.log("Process Email job...", job.id, job.name, job.data)
        await new Promise((res) => setTimeout(res, 1500)),
            console.log("Completed Email job...",)
    },
    { connection }
)

emailWorker.on("completed", (job) => {
    console.log("Completed Email job...", job.id, job.name, job.data)
})

emailWorker.on("failed", (job, err) => {
    console.log("Failed Email job...", job.id, job.name, job.data)
    console.log(err)
})