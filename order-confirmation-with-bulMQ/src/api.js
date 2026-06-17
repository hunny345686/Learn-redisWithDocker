import express from "express";
import { emailQueue } from "./queue.js"

const app = express();
app.use(express.json());



app.post("email", async (req, res) => {
    const { to, email, subject, body } = req.body

    const job = emailQueue.add("Add-email",
        {
            to, email, subject, body
        },
        {
            attempts: 3,

        }

    )
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 