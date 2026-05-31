export const socketConnection = (io) => {

    //socket connection
    io.on("connection",(socket) => {
        console.log("socket succeesfully connected...");
        console.log("user connected:",socket.id);

         // join-room
        socket.on("join-room",(roomId) => {
            //join the room id
            socket.join(roomId);
            console.log(`${socket.id} joins the ${roomId}`);
            socket.to(roomId).emit("user-joined")
        })

        //listen offer send by client
        socket.on('offer',({roomId, offer}) => {
            console.log("Sending offer to room:", roomId);

            socket.to(roomId).emit("receive-offer",offer);
        })

        //answer listner
        socket.on("answer",({roomId, answer}) => {
            console.log("answer received");

            socket.to(roomId).emit("receive-answer",answer);
        })

        //ice-candidates
        socket.on("ice-candidate",({roomId,candidate}) => {
            socket.to(roomId).emit("ice-candidate-received",candidate);
        })

        // specific user disconnected
        socket.on("disconnect",()=>{
            console.log(`${socket.id} disconnected`)
        })
    })  
}

export default socketConnection;