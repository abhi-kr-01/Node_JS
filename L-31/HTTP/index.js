const http = require("node:http");

//create server create server which take callback function int which req,res is send ot recieve
const server = http.createServer((req,res) => {
    console.log(`Hey, I'm here recieve a request`);

    //....all function for sending res to client 

    res.writeHead(200,"Hey,You successfully recieved data");
    res.end("Thankyou for visit my server");
}); 

server.listen(8000,()=>{
    console.log(`server is running of port: 8000`);
})