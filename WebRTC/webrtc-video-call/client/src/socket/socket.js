import { io } from 'socket.io-client'

//console.log(import.meta.env.VITE_SOCKET_URI)   // IN VITE process.env ❌
const socket = io(import.meta.env.VITE_SOCKET_URI)

export default socket;