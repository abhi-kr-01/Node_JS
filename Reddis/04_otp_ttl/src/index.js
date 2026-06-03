import express from 'express'
import Redis from 'ioredis'

const app = express();
app.use(express.json());

const redis = new Redis("redis://localhost:6379");


//set key for otp 
function otpKey(phone){
    return `otp:${phone}`;
}

app.post("/send-otp",async (req,res) => {
    const {phoneNumber} = req.body;

    if(!phoneNumber){
        return;
    }

    const otp = Math.floor(100000+Math.random()*900000).toString();
    await redis.set(otpKey(phoneNumber),otp,"EX",30);  // otp is valid for 30 sec

    res.json({message: `otp send: ${otp}`})
})

app.post('/otp-verify',async(req,res) => {
    const { phone, userOTP} = req.body;

    const savedOTP = await redis.get(otpKey(phone))

    if(!savedOTP){
        return res.status(400).json({message: "OTP expired or not found"});
    }

    if(userOTP !== savedOTP){
        return res.status(400).json({message: "Invalid OTP"});
    }

    //verify user here then

    await redis.del(otpKey(phone));
    res.json({message: "OTP verified successfully"})
})

// to know the ttl of the otp
app.get("/otp/:phone/ttl",async (req,res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone));
    res.json({ttl});
})

app.listen(3000,() => {
    console.log("server is running at 3000");
})