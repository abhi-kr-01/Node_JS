import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from "./config/db.js"
import { initializeSocket } from './socket/chatSocket.js'


dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({
    origin: "http://localhost:5173"
}))

// create http server 
const server = createServer(app);

// attach server to socket io
const io = new Server(server, {
    cors : {
        origin: "http://localhost:5173"
    }
})

// PASS DB AND IO INSTANCE TO SOCKET CONTROLLER
initializeSocket(io);   

// Normal route
app.get("/", (req, res) => {
    res.send("Server running");
});


// Use server.listen, NOT app.listen
server.listen(3000, () => {
    console.log(
        "Server running at http://localhost:3000"
    );
});