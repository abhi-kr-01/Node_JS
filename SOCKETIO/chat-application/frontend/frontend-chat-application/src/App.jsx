import { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useState } from "react";
import "./App.css"

function App() {

    const inputRef = useRef(null);
    const usernameRef = useRef("");

    const [message,setMessage] = useState("");
    const [messages,setMessages] = useState([]);
    const [mySocketId,setMySocketId] = useState("");
    const [username,setUsername] = useState("");
    const [onlineUsers,setOnlineUsers] = useState(0);

    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            sendMessage();
        }
    }

    useEffect(() => {
        const name = prompt("Enter username:");

        const finalName = name?.trim() || "Ananonymous";
        setUsername(finalName);

        usernameRef.current = finalName;
    },[])

    useEffect(() => {

        // socket.on(
        //     "connect",
        //     () => {

        //         // console.log(
        //         //     "client connected",socket.id
        //         // );
        //         // console.log("My Socket ID:",socket.id);

        //         // socket.emit(
        //         //     "message",
        //         //     "Hello server"
        //         // );


        //     }
        // );

        // socket.on(
        //     "reply",
        //     (data) => {

        //         console.log(
        //             "server says:",
        //             data
        //         );
        //     }
        // );

        //socket.off("receive-message");
        socket.on('recieved-message',(message)=>{
            setMessages((prev) => [...prev,message])
        })

        
        socket.on('connect',()=>{
            socket.emit('join-chat',usernameRef.current);
        })

        socket.on('user-joined',(message) => {
            setMessages((prev) => [
                ...prev,
                {
                    system: true,   // to style system messages differently.
                    text: message
                }
            ])
        });

        socket.on("user-left",(message) => {
            setMessages((prev) => [
                ...prev,
                {
                    system: true,   // to style system messages differently.
                    text: message
                }
            ])
        });

        socket.on("online-users",(count) => {
            setOnlineUsers(count);
        })

        // connect AFTER listeners
        socket.connect();

        inputRef.current?.focus()

        return () => {

            socket.off("connect");
            //socket.off("reply");

            socket.off(
                "received-message"
            );

            socket.off(
                "online-users"
            );

            socket.off(
                "user-joined"
            );

            socket.off(
                "user-left"
            );

            socket.disconnect();
            };

    }, []);

    const sendMessage = () => {
        if(!message.trim){
            return ;
        }

        socket.emit('send-message',{text:message,username});
        setMessage("");
        inputRef.current?.focus()
    }


    return (

        <div className="chat-container">
            <h1>
                Mini Chat
            </h1>
            <h3>
                Online Users: {onlineUsers}
            </h3>

            <div className="chat-box">

                {
messages.map(
(msg,index)=>{

if(msg.system){

return(

<div
key={index}
className=
"system-message"
>
{msg.text}
</div>

);
}

const isMine =
msg.senderId ===
socket.id;

return(

<div
key={index}
className={
isMine
?
"message-right"
:
"message-left"
}
>

<div
className=
"message-user"
>
{msg.username}
</div>

<div
className=
"message-text"
>
{msg.text}
</div>

</div>

);

})
}

            </div>

            <div
              className=
              "input-area"
            >

                <input
                    type="text"
                    ref={inputRef}
                    onKeyDown={ handleKeyDown }
                    value={message}
                    onChange={
                        (e) =>
                        setMessage(
                            e.target
                            .value
                        )
                    }
                    placeholder=
                    "Type message ..."
                />

                <button
                  onClick={
                    sendMessage
                  }
                >
                    send
                </button>

            </div>

        </div>
    );
}

export default App;