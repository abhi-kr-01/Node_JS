import Redis from 'ioredis'

const subscriber = new Redis("redis://localhost:6379");

subscriber.subscribe('notification',(err,count) => {
    if(err){
        console.log("failed to subscribe:",err)
        return;
    }
    console.log("subscribed successfully!");
})

subscriber.on("message",(channel,message) => {
    console.log("Received on ",channel,":",JSON.parse(message));
})