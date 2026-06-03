import express from 'express'
import Redis from 'ioredis'
import mongoose, { mongo } from 'mongoose'

const app = express()

//we made client for reddis as we made for mongo 
const redis = new Redis( process.env.REDIS_URL || 'redis://localhost:6379');

app.get('/redis',async (req,res) => {
    const reply = await redis.ping();
    res.json({redis: reply });
})

app.get('/mongo',async (req,res) => {
    const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/code_with_redis';

    if(mongoose.connection.readyState === 0){
        await mongoose.connect(url);
    }

    res.json({
        mongo: 'connected',
        database : mongoose.connection.name
    })
})

app.listen(3000, ()=> {console.log(`your server is running at PORT : 3000`)})

// made client for mongoose