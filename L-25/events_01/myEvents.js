const EventEmitter = require("node:events");

const eventEmitter = new EventEmitter();  //calling eventEmitter


// on("eventName",callBack function/listner) ->  
eventEmitter.on('greet',(data)=>{
    console.log(`Hello ${data} welcome to Envent Listner`);
})

//it excecute only once
eventEmitter.once('pushnotify',()=>{
    console.log("This evnet will run only once");
})

//Emits the Event
// eventEmitter.emit('greet','we can pass data');
// // the data we pass in emit function ir transfer data to on.callback function
// eventEmitter.emit('greet','It will come infinte times');
// eventEmitter.emit('pushnotify'); 
// eventEmitter.emit('pushnotify'); //it will not run again


const myListener = () => { console.log("I am a test Listener")};

eventEmitter.on('test',myListener);
eventEmitter.emit('test');
eventEmitter.removeListener('test',myListener);
eventEmitter.emit('test');