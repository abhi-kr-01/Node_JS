const ChatRoom = require('./chatroom');

const chat = new ChatRoom();

chat.on('join',(user)=>{
    console.log(`${user} has joined the Chat`);
});


chat.on('sendMessage',(user,msg)=>{
    console.log(`${user}: ${msg}`);
});


chat.on('leave',(user)=>{
    console.log(`${user} has left the chat`);
});

//simulating the chat

chat.join('Alice');
chat.join('bob');

chat.sendMessage("Alice","Hello Bob, hello to everyOne");
chat.sendMessage("bob","Hello Alice, hello to everyOne");

chat.leave('Alice');

chat.sendMessage('Alice',"You won't be sende message");

chat.leave('bob');