//all express related work is from here

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app =express();

// middlewares ko use krna hai to app.use() compulsory hai
// it helps in taking data from frontend to use in backend 
///anyone can make own middleware
app.use(express.json({limit:'16Kb'}));
app.use(express.urlencoded({extended: true, limit: "16Kb"}));
app.use(express.static("public")); // to take data from that folder written in the argument of static()
app.use(cookieParser());  // we are able to access the  cookies

//cors configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET" ,"POST" ,"PUT","DELETE","PATCH","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorisation"]
}));

//routes

import healthCheckRoutes from './routes/healthCheck.route.js'
import authRouter from './routes/auth.route.js';

app.use('/api/v1/healthcheck',healthCheckRoutes);

app.use('/api/v1/auth',authRouter);

app.get("/",(req,res)=>{
    res.send("hello, World!");
})

export default app;