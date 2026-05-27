import { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useState } from "react";
import "./App.css"

function App() {

    const inputRef = useRef(null);
    const usernameRef = useRef("");
    const roomNameRef = useRef("");
    const typingTimeOutRef = useRef(null);
    const messagesEndRef = useRef(null);
    const chatBoxRef = useRef(null);

    const [message,setMessage] = useState("");
    const [messages,setMessages] = useState([]);
    const [mySocketId,setMySocketId] = useState("");
    const [username,setUsername] = useState("");
    const [onlineUsers,setOnlineUsers] = useState(0);
    const [room, setRoom] = useState("");

    // adding typing features
    const [typing,setTyping] = useState("");

    const handleTyping = (e) => {
        setMessage(e.target.value);
        socket.emit("typing");
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            sendMessage();
        }
    }

    // useEffect(() => {
    //     const name = prompt("Enter username:");
    //     const roomName = prompt("Enter roomName");

    //     const finalName = name?.trim() || "Ananonymous";
    //     setUsername(finalName);

    //     const finalRoomName = roomName?.trim() || "Random room";
    //     setRoom(finalRoomName);

    //     console.log(finalName);
    //     console.log(finalRoomName);

    //     socket.emit("join-room",{username: finalName, room: finalRoomName})

    //     usernameRef.current = finalName;
    //     roomNameRef.current = finalRoomName;
    // },[])

    useEffect(() => {

        const name = prompt("Enter username:");
        const roomName = prompt("Enter roomName");

        const finalName = name?.trim() || "Ananonymous";
        setUsername(finalName);

        const finalRoomName = roomName?.trim() || "Random room";
        setRoom(finalRoomName);

        console.log(finalName);
        console.log(finalRoomName);

        socket.emit("join-room",{username: finalName, room: finalRoomName})

        usernameRef.current = finalName;
        roomNameRef.current = finalRoomName;

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

        // typing listener
        socket.on("user-typing",(message)=>{
            setTyping(message)

            clearTimeout(typingTimeOutRef.current);

            typingTimeOutRef.current = setTimeout(() => {
                setTyping("");
            },1000);
        })

        //fetching history
        socket.on(
            "chat-history",
            (history) => {
                console.log(history);
                setMessages(history);
            }
        );

        //socket.off("receive-message");
        socket.on('recieved-message',(message)=>{
            setMessages((prev) => [...prev,message])
        })

        
        // socket.on('connect',()=>{
        //     socket.emit('join-chat',usernameRef.current);
        // })

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
            socket.off("user-typing");

            socket.off("chat-history");

            socket.off(
                "recieved-message"
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

    useEffect(() => {

        const chatBox =
            chatBoxRef.current;

        if (!chatBox) return;

        const isNearBottom =

            chatBox.scrollHeight -
            chatBox.scrollTop -
            chatBox.clientHeight
            < 100;

        if (isNearBottom) {

            messagesEndRef.current
                ?.scrollIntoView({
                    behavior: "smooth"
                });
        }

    }, [messages]); // run this effect when only when messages changes 


    const sendMessage = () => {
        if(!message.trim()){
            return ;
        }

        socket.emit('send-message',{text:message});
        setMessage("");
        inputRef.current?.focus()
    }


    return (
        <div className="chat-container">

            <div className="chat-header">

                <h1>Room Chat</h1>

                <div className="room-info">
                    <p>
                        👤 {username}
                    </p>

                    <p>
                        🏠 Room: {room}
                    </p>

                    <p>
                        🟢 Online: {onlineUsers}
                    </p>
                </div>

            </div>

            <div className="chat-box" ref={chatBoxRef}>


                {
                    messages.map((msg, index) => {

                        if (msg.system) {
                            return (
                                <div
                                    key={index}
                                    className="system-message"
                                >
                                    {msg.text}
                                </div>
                            );
                        }

                        // const isMine =
                        //     msg.senderId === socket.id;
                        const isMine = msg.username === username;

                        return (
                            <div
                                key={index}
                                className={
                                    isMine
                                        ? "message-right"
                                        : "message-left"
                                }
                            >

                                <div className="message-user">
                                    {msg.username}
                                </div>

                                <div className="message-text">
                                    {msg.text}
                                </div>

                                <div className="message-time">
                                    {msg.timestamp}
                                </div>

                            </div>
                        );
                    })
                }
                <div ref={messagesEndRef}></div>
            </div>
            {
                typing && (
                    <div className="typing-indicator">
                        {typing}
                    </div>
                )
            }

            <div className="input-area">

                <input
                    type="text"
                    ref={inputRef}
                    value={message}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                    placeholder="Text message..."
                />

                <button
                    onClick={sendMessage}
                >
                    Send
                </button>

            </div>

        </div>
    );
}

export default App;