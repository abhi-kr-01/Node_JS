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

//listen for connection 
// io.on("connection",(socket) => {
//     console.log("client connected");
//     console.log(socket.id)
// })
io.on("connection", (socket) => {

    console.log("Connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });

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