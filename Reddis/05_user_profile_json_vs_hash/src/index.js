import express from 'express'
import Redis from 'ioredis' 

const app = express()
app.use(express.json())

const redis = new Redis("redis://localhost:6739");

// seting object in redis  -- basic way to set it
app.post("/user/:id/json",async (req,res) => {
    const userId = req.params.id;
    const data = req.body;
    
    await redis.set(`user:${userId}:json`,JSON.stringify(data));  // data stored in string
    res.json({savedAs : "json"});
})

app.get("/user/:id/json",async (req,res) => {
    const data = await redis.get(`user:${req.params.id}:json`)
    res.json({
        user : data ? JSON.parse(data) : null  
    })
})

//  ----- best way  ----- using hash ----- data is not stored in string --- it in object
app.post("/user/:id/hash",async (req,res) => {
    await redis.hset(`user:${req.params.id}:hash`,req.body);
    res.json({savedAs : "hash"})
})

app.get("user/:id/hash",async (req,res) => {
    const user = await redis.hgetall(`user:${req.params.id}:hash`);
    res.json({user});
})

app.listen(3000,()=> console.log("server is running..."));

// and many more methods are available
// hget() --> iit give only single field
// hdel()  --> for delete the object
// hexists() --> objec is available or not ?
  