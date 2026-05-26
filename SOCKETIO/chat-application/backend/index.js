// import express from 'express'
// import cors from 'cors'

// const app = express();

// const allowedOrigins = [
//     "http://localhost:5173"
// ]

// app.use(cors({
//     origin: function (origin, callback) {

//         if (!origin) {
//             return callback(null, true);
//         }

//         if (allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },

//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: [
//         "Content-Type",
//         "Authorization"
//     ]
// }));

// app.get("/",(req,res) => {
//     res.send("<h1>Hello world</h1>")
// })

// app.get("/api/message",(req,res) => {
//     res.json({message: "Hello from server"})
// })

// app.listen(3000,() => {console.log(`server is listening at PORT : http://localhost:${3000}`)})

import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()

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

let onlineUser = 0;

//listen for connection 
// io.on("connection",(socket) => {
//     console.log("client connected");
//     console.log(socket.id)
// })
// io.on("connection", (socket) => {

//     console.log("Connected:", socket.id);

//     socket.on("disconnect", () => {
//         console.log("Disconnected:", socket.id);
//     });

// });

// custom event handling for client and server 

// io.on("connection", (socket) => {

//     console.log("Connected:", socket.id);

//     //socket.on(evenetName,callback)  -- listen the event
//     socket.on('message',(data)=> {
//         console.log("recieved:",data);
//         socket.emit("reply","hello user from server");
//     })

//     socket.on("disconnect", () => {
//         console.log("Disconnected:", socket.id);
//     });

// });



// now create a socket connection in which one client send message it reflect to all client which is connected
io.on("connection", (socket) => {

    console.log("Connected:", socket.id);
    socket.on('join-chat',(username)=>{
        onlineUser++;
        socket.username = username;   // add custom method "username" on socket like id -- yes we can add custom to disconnect b/c disconnect not pass any username to tell every one xyz user diconnected
        
        console.log(onlineUser);  // testing

        socket.broadcast.emit("user-joined", `${username} joined chat`)   // broadcast -- to show everyone except user

        io.emit("online-users",onlineUser);
    })

    socket.on('send-message',(data) => {
        io.emit("recieved-message",{
            text: data.text,
            senderId: socket.id,
            username: data.username
        });
    })

    socket.on('disconnect',()=>{
        console.log("Disconnected:",socket.id);
        onlineUser--;

        socket.broadcast.emit('user-left',`${socket.username} left chat`);

        io.emit("online-users",onlineUser);

        
    })

});

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