const express = require("express");

const app = express();

app.get('/',(req,res)=>{
    res.end('HomePage');
});

app.get('/contact-us',(req,res)=>{
    res.end('You can contact me at my email address:example@com');
});

app.get('/tweet',(req,res)=>{
    res.end("here are your tweet");
});

app.post('/tweet',(req,res)=>{
    res.status(201).end("Tour tweet is succesfully posted");
});



app.listen(8000,()=>console.log('sever is running at PORT :8000'));