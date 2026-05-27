import Message from "../models/messages.schema.js"

let onlineUser = 0;
const users = {};

export const initializeSocket = (io) => {

// now create a socket connection in which one client send message it reflect to all client which is connected
io.on("connection", (socket) => {

    //console.log("Connected:", socket.id);

    socket.on("typing",() => {
        const user = users[socket.id];

        if(!user) return;

        socket.to(user.room).emit("user-typing",`${user.username} is typing...`)
        //console.log(`${user.username} typing`);
    })

    //join-room
    socket.on('join-room',async (data) => {
        //console.log(data);

        // tell the server which socket will join with which room
        socket.join(data.room);

        const targetRoom = data.room

        const roomMessage = await Message.find({room: targetRoom}).sort({createdAt:1}); // find the data of user using room and then sort it according to timestamp

        socket.emit("chat-history",roomMessage.map((msg) => ({
            text: msg.text,
            username: msg.username,
            senderId: null,
            timestamp: new Date(
                    msg.createdAt
                )
                .toLocaleTimeString(
                    [],
                    {
                        hour:
                            "2-digit",

                        minute:
                            "2-digit"
                    }
                )
        })))

        // multiple join room
        // socket.join(["room1","room2"]);
        //console.log(`${data.username} joined :${data.room}`);

        //store user data in server b/c at this points
        // ==> server only know socket.id 

        users[socket.id] = {
            username: data.username,
            room: data.room
        };

        onlineUser++;

        io.to(data.room).emit("online-users",onlineUser);

        //console.log(users);

        socket.to(data.room).emit(
            "user-joined",
            `${data.username} joined chat`
        )
    })


    // socket.on('join-chat',(username)=>{
    //     onlineUser++;
    //     socket.username = username;   // add custom method "username" on socket like id -- yes we can add custom to disconnect b/c disconnect not pass any username to tell every one xyz user diconnected
        
    //     console.log(onlineUser);  // testing

    //     socket.broadcast.emit("user-joined", `${username} joined chat`)   // broadcast -- to show everyone except user

    //     io.emit("online-users",onlineUser);
    // })


    // socket.on('send-message',(data) => {
    //     io.emit("recieved-message",{
    //         text: data.text,
    //         senderId: socket.id,
    //         username: data.username
    //     });
    // })

    // after making "join-room" : same room user send message to only same room not to everyone
    // socket.on("send-message",(data) => {

    //     //find user 
    //     const user = users[socket.id];

    //     //emit message
    //     io.to(user.room).emit("recieved-message",{
    //         text: data.text,
    //         senderId: socket.id,
    //         //username: data.username --> it is bad practice b/c frontend can lie
    //         username: user.username, // trusted server data
    //         timestamp: new Date().toLocaleTimeString([],
    //             {
    //                 hour: "2-digit",
    //                 minute: "2-digit"
    //             }
    //         )
    //     })
    // })

    // DB connection
    socket.on("send-message", async (data) => {

        try {
            //find user 
            const user = users[socket.id];

            if(!user) return;


            //save to DB
            const savedMessage = await Message.create(
                {
                    username: user.username,
                    text: data.text,
                    room: user.room
                }
            );

            // broadcast 
            io.to(user.room).emit("recieved-message",{
                text: savedMessage.text,
                senderId: socket.id,
                //username: data.username --> it is bad practice b/c frontend can lie
                username: savedMessage.username, // trusted server data
                timestamp: new Date(savedMessage.createdAt).toLocaleTimeString([],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )
            });

        } catch (error) {
            console.error("Message saved failed: ",error.message)
        }
    })

    // socket.on('disconnect',()=>{
    //     console.log("Disconnected:",socket.id);

    //     onlineUser--;



    //     socket.broadcast.emit('user-left',`${socket.username} left chat`);

    //     io.emit("online-users",onlineUser);

        
    // })

    socket.on("disconnect",()=>{
        //console.log("Disconnected:",socket.id);

        const user = users[socket.id];

        // Prevent crash
        if (!user) {
            console.log(
                "User already removed or never joined"
            );
            return;
        }

        if(user) {
            onlineUser--;

            socket.to(user.room).emit("user-left",`${user.username} left chat`)
        }

        io.to(user.room).emit("online-users",onlineUser)

        delete users[socket.id]
    });

});
}