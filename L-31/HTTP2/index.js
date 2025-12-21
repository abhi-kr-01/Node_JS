//for start server : 1) node filename
//                   2) go to json file start :"node filename",  -> in terminal -> npm start
// when ever we create change in code we have to restart the server to to stop it 
// start : "node --watch filename.js";
//or instal nodemon


const http = require("node:http");

const server = http.createServer((req,res)=>{

    switch(req.url){
        case '/':
            res.writeHead(200);
            return res.end('HomePage');
        case '/contact-us' :
            res.writeHead(200);
            return res.end(`contact Me at : ${7856831085}`);
        case '/about' :
            res.writeHead(200);
            return res.end(`I'm a web Developer`);
        default :
            res.writeHead(400);
            res.end("You are LOst");
    }
});

server.listen(8000,()=>{
    console.log(`server is run at port:8000`);
})