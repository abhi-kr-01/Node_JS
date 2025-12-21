const eventEmitter = require('events');

//extend smeans it has chat has all power of eventEmitter
class Chat extends eventEmitter{

    sendMessage(msg){
        console.log(`Message sent: ${msg}`);
        this.emit('messageRecieved',msg);
    }
};

const chat = new Chat();
chat.on('messageRecieved',(msg)=>{
    console.log(`New Message : ${msg}`);
})

//triggered event

chat.sendMessage("Hello Abhishek");