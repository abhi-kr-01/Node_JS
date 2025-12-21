import { Console, time } from 'console';
import express from 'express';

//1758543804986

const app = express();
const PORT = 8000;

//midddleware
app.use(express.json());

//db
const DIARY = {

};
const EMAILs = new Set();

//route

//e.g: Hey, there is a car -Please park it and give me back a token
      //email -> car no.
app.post('/signup',(req,res)=>{
    const { name , email , password} = req.body

    if(EMAILs.has(email)){
        return res.status(400).json({error:'Email is alredy taken'});
    }

    //create a token for user
    const token = `${Date.now()}`;

    //do diary entry
    DIARY[token] = {name,email,password};
    EMAILs.add(email);

    return res.json({status: 'successful','token':token});
});

app.post('/me',(req,res)=>{
    const {token} = req.body;

    if(!token){
        return res.status(400).json({error: `missing token`});
    }

    if(!(token in DIARY)){
        return res.status(400).json({error:'Invalid token'});
    }
    const entry = DIARY[token];

    return res.json({"data": entry});
});



app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));