const fs = require("node:fs");

//start exceution
console.log("start the excecution");

// [Sync] --> Blocking  function  -> it block the execution of code below it's until it doesnot comlete it own work

// const content = fs.readFileSync("notes.txt","utf-8");
// console.log(content);

// [Async]  -> Non-Blocking function  -> it doen't block the exceution of code below it exceute after completing of work
// but it return callback function
const content = fs.readFile("notes.txt","utf-8", (error,data) => {
    if(error) console.log(error);
    else console.log("The content is: \n",data);
})

// end exceution
console.log("Execution of code end ");

