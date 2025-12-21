const EventEmitter = require('events');

const eventEmitter  = new EventEmitter();

class ChatRoom extends EventEmitter{

    constructor(){
        super();  //it call the constructor of parent class(Eventemitter) it also have argument
        this.users = new Set();  //set() is data structure of js in which it store only uniue data
    }

    join(user){
        this.users.add(user);
        this.emit('join',user);
    }

    sendMessage(user,msg){
        if(this.users.has(user)){ // has() check it is exist or not in js 
            this.emit('sendMessage',user,msg);
        }else{
            console.log(`${user} is not in chat`);
        }
    }

    leave(user){
        if(this.users.has(user)){
            this.users.delete(user);
            this.emit('leave',user);
        }else{
            console.log(`${user} is not in chat`);
        }
    }
}

module.exports = ChatRoom;