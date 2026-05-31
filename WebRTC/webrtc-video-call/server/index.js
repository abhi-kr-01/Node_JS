import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import socketConnection from './socket/socket.js' 


const PORT = process.env.PORT ? +process.env.PORT : 3000;

const app = express()
const server = http.createServer(app)  // create http server : express -> wrapped inside http server -> and socket.io attach here

// socket attachment
const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        method : ['GET','POST']
    }
})

socketConnection(io);

app.get('/',(req,res) => {
    res.send("<h1>Home Page</h1>")
})

server.listen(PORT,()=>{
    console.log(`server is  listening at http://localhost:${PORT}`);
})