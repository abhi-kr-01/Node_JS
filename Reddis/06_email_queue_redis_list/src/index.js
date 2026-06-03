import express from 'express'
import Redis from 'ioredis'

const app = express()
app.use(express.json());

const redis = new Redis("redis://localhost:6379");

const QUEUE_KEY = "queue:emails";

//send email
app.post("/email",async (req, res) => {
    // making job/task

    const job = {
        to : req.params.to,
        subject : req.params.subject || "No subject",
        content : req.params.content || "No content",
        createdAt: new Date().toISOString()
    }

    // adding email job from left 
    await redis.lpush(QUEUE_KEY,JSON.stringify(job));

    res.json({queud: true,job});
})

//
app.get("emails/process-one",async (req,res)=>{
    const rawjob = await redis.rpop(QUEUE_KEY);

    if(!rawjob){
        return res.json({message: "no jons in queue"})
    }

    const job = JOSN.parse(rawjob);

    res.json({message: "email sent", job});
})

app.listen(3000,()=>console.log("server is running at 3000..."));

// -  problem with redis 
// 1. job loss
// 2. retry system
// 3. parallel work
