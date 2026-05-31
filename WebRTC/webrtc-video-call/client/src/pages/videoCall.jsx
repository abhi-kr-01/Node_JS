import React, { useEffect, useRef, useState } from 'react';
import socket from '../socket/socket.js';

export default function VideoCall() {
    const localvideoRef = useRef(null);  
    const remotevideoRef = useRef(null);  
    const streamRef = useRef(null);
    const PeerConnectionRef = useRef(null);  
    const roomIdRef = useRef(null);
    const remoteStreamRef = useRef(null); // Will initialize when connection is created

    const [isMuted, setIsMuted] = useState(false);
    const [isCamreOff, setIsCameraOff] = useState(false);
    const [roomId, setRoomId] = useState("");

    // Setup Peer Connection
    const createPeerConnection = () => {
        // Initialize remote stream container if not already done
        if (!remoteStreamRef.current) {
            remoteStreamRef.current = new MediaStream();
            if (remotevideoRef.current) {
                remotevideoRef.current.srcObject = remoteStreamRef.current;
            }
        }

        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" }
            ]
        });

        PeerConnectionRef.current = peer;

        // Logging connection states
        peer.onconnectionstatechange = () => {
            console.log("Connection State Changed:", peer.connectionState);
        };

        peer.oniceconnectionstatechange = () => {
            console.log("ICE Connection State Changed:", peer.iceConnectionState);
        };

        // ICE candidates exchange
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("ICE candidate generated, emitting...");
                socket.emit("ice-candidate", {
                    roomId: roomIdRef.current, // Use ref instead of state to guarantee accuracy
                    candidate: event.candidate
                });
            }
        };

        // Catch incoming remote tracks
        peer.ontrack = (event) => {
            console.log("TRACK EVENT FIRED:", event.track.kind);
            
            // Add track to our existing remote stream container
            remoteStreamRef.current.addTrack(event.track);
        };

        // Pass local tracks to peer connection if camera was already started
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                peer.addTrack(track, streamRef.current);
            });
            console.log("Local tracks added to Peer Connection");
        } else {
            console.warn("Peer connection created without local tracks! (Camera not started)");
        }

        console.log("Peer Connection Successfully Created.");
    };

    // Create Offer (Caller)
    const createOffer = async () => {
        if (!PeerConnectionRef.current) return;
        
        const offer = await PeerConnectionRef.current.createOffer();
        await PeerConnectionRef.current.setLocalDescription(offer);
        
        console.log("Sending offer to room:", roomIdRef.current);
        socket.emit('offer', { roomId: roomIdRef.current, offer });
    };

    // Create Answer (Receiver)
    const createAnswer = async (offer) => {
        if (!PeerConnectionRef.current) return;

        await PeerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        console.log("Remote description set on receiver");

        const answer = await PeerConnectionRef.current.createAnswer();
        await PeerConnectionRef.current.setLocalDescription(answer);
        console.log("Local description set on receiver");

        socket.emit("answer", {
            roomId: roomIdRef.current,
            answer
        });
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            streamRef.current = stream;
            if (localvideoRef.current) {
                localvideoRef.current.srcObject = stream;
            }
            console.log("Local camera stream started.");
        } catch (err) {
            console.error("Error accessing media devices:", err.message);
        }
    };

    const micToggle = () => {
        if (!streamRef.current) return;
        const audioTrack = streamRef.current.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    };

    const cameraToggle = () => {
        if (!streamRef.current) return;
        const cameraTrack = streamRef.current.getVideoTracks()[0];
        if (cameraTrack) {
            cameraTrack.enabled = !cameraTrack.enabled;
            setIsCameraOff(!cameraTrack.enabled);
        }
    };

    const joinRoom = () => {
        if (!roomId) return alert("Please enter a room ID first");
        roomIdRef.current = roomId;
        socket.emit("join-room", roomId);
        console.log('Emitted join-room for:', roomId);
    };

    // Socket listeners setup
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to Signaling Server:", socket.id);
        });

        // When another user joins your room (You are the Caller)
        socket.on('user-joined', async () => {
            console.log("Another user joined your room. Initiating WebRTC...");
            createPeerConnection();
            await createOffer();
        });

        // When you receive an offer (You are the Receiver)
        socket.on('receive-offer', async (offer) => {
            console.log("Received remote offer.");
            if (!PeerConnectionRef.current) {
                createPeerConnection();
            }
            await createAnswer(offer);
        });

        // When the Caller receives back the answer
        socket.on("receive-answer", async (answer) => {
            console.log("Received remote answer.");
            if (PeerConnectionRef.current) {
                await PeerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        // When an ICE candidate arrives
        socket.on("ice-candidate-received", async (candidate) => {
            console.log("Received remote ICE candidate.");
            if (PeerConnectionRef.current && candidate) {
                try {
                    await PeerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                    console.error("Error adding received ICE candidate", e);
                }
            }
        });

        return () => {
            socket.off("connect");
            socket.off("user-joined");
            socket.off("receive-offer");
            socket.off("receive-answer");
            socket.off("ice-candidate-received");
        };
    }, [roomId]); // Added roomId dependency to keep effect awareness sharp

    return (
        <div>
            <h1>Video-Call App</h1>
            <input type='text' placeholder='Enter roomId' value={roomId} onChange={(e) => setRoomId(e.target.value)}/>
            <br/><br/>
            <button onClick={startCamera}>1. Start Camera</button>
            <button onClick={joinRoom}>2. Join Room</button>
            <br/><br/>
            
            <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                    <h3>Local Video</h3>
                    <video ref={localvideoRef} muted autoPlay playsInline width={"400px"} style={{ background: '#222' }}/>
                </div>
                <div>
                    <h3>Remote Video</h3>
                    <video ref={remotevideoRef} autoPlay playsInline width={"400px"} style={{ background: '#222' }}/>
                </div>
            </div>

            <div>
                <button onClick={micToggle}>{isMuted ? "Unmute" : "Mute"}</button>
                <button onClick={cameraToggle}>{isCamreOff ? "Camera On" : "Camera Off"}</button>
            </div>
        </div>
    );
}