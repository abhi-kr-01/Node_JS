// import { useState } from 'react'
// import { useEffect } from 'react'
// import axios from 'axios'

// function App() {
  
//   const [message,setMessage] = useState("");

//   useEffect(()=>{
//     const getData = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/api/message")
//         setMessage(response.data.message);
//       } catch (error) {
//         console.log(error);
//       }
//     }

//     getData()
//   },[])

//   return(
//     <div>
//       <h1> {message} </h1>
//     </div>
//   )
// }

// export default App


import { useEffect } from "react";
import { io } from "socket.io-client";
import { socket } from "./socket";

function App() {

    useEffect(() => {

        socket.connect()


        return () => {
            socket.disconnect();
        };

    }, []);

    return (
        <h1>Socket Connected</h1>
    );
}

export default App;