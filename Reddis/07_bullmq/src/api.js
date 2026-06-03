import express from 'express'
import { emailQueue } from './queue.js'
import { Backoffs } from 'bullmq';

const app = express();
app.use(express.json());

app.post("/welcome-email",async (req,res) => {
    emailQueue.add(
        "send welcome email",
        {
            to : req.body.to,
            name : req.body.name,    // data

        },
        {
            attempts: 3,  //configuration\  -- restriction
            Backoffs: {
                type: "exponential",
                delay: 1000
            }
        }
    )

    res.json({message: "email added in the queue", jobId: job.id});
})

app.listen(3000,() => console.log("server is listening at 3000..."));
