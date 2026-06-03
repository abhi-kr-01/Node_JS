import express from 'express'
import Redis from 'ioredis'

const app = express()

const publisher = new Redis("redis://localhost:3000");

app.post("/notifications",async(req,res) => {
    const payload = {
        title: req.body.title  || "Default title",
        createdAt : new Date().toISOString()
    }

    const receiver = await publisher.publish("notifications",JSON.stringify(payload));

    res.json({message : "notification send"})

})

app.listen(3000,()=> console.log("server is running..."))