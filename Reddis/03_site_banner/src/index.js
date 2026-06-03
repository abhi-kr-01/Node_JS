import express from 'express'
import Redis from 'ioredis'

const app = express();
app.use(express.json());  // for data body parser

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379" );

const BANNER_KEY = "app:banner"    // standard way for writing key in redis

//set the key-value 
app.post("/banner",async(req,res) => {
    await redis.set(BANNER_KEY,req.body.message || "Welcome to our website" ); 

    res.json({succes: true});
})

//get the key value
app.get("/banner", async (req,res) => {
    const message = await redis.get(BANNER_KEY);
    res.json({message : message});
})

//deletion of key
app.delete("/banner",async (req,res) => {
    await redis.delete(BANNER_KEY);
    res.json({success: true});
})

//checking that does key exists or not in db
app.get("/banner/exists",async (req,res) => {
    const exists = await redis.exists(BANNER_KEY)
    console.log(exists);
    res.json({success: !!exists});    // !! -> conver it into boolean  or Boolean(exists)
})

app.listen(3000,() => console.log("server is listening at 3000"));