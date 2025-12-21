import { Socket } from 'dgram';
import express from 'express';
import http from 'http';
import path from 'path';
import {Server} from 'socket.io'

const app = express();

// when we have to attach socketio with PORT then
// we can't dierectly attach with it 
// we have to use http module for attachment of websocket

const server = http.createServer(app);  // create server with http

// app.use(express.static("/public"));  // given file not work . it shown an error
// to resolve this issue we have to use path module
app.use(express.static(path.resolve('./public')));


app.get("/",(req,res)=>{
    return res.sendFile("./public/index.html");
})


// using socket

const io = new Server(server);  // io will handle all socket request

// connection with frontend
io.on("connection", (socket)=>{  // socket is client for callback function socket == client
    //console.log("A new user has connected",socket.id);
    socket.on('user-message',(message) => {
        // console.log("A new User message", message); -- it store on server 
        // but we have to emit all the message
        io.emit("message",message);
    });
});

// socket.io() => frfontend se koi message aata hai named "user-message" then (msg)=>{io.emit((msg))} send msg to all the server connected with -- this "msg" is used in frontend for show the message for user
// this server

server.listen(8080,()=>console.log(`server is running at 8080`));
