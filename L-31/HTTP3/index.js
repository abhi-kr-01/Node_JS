const http = require("node:http");
const fs = require("node:fs");

const server = http.createServer((req,res)=>{
    const method = req.method;
    const path = req.url;

    // switch(path){
    //     case '/':
    //         return res.writeHead(200).end("You are on HomePage :) ");
    //     case '/contact-us':

    // }  --> in this case if we req post method then it also show which is not good practice

    const log = `\n[${Date.now()} : Method : ${method} : Path : ${path}]`;  //i have to store this whenever any client send request
    //storing data in file
    fs.appendFileSync('log.txt',log,"utf-8");

    switch(method){

        case 'GET':{
            switch(path){
                case '/':
                    return res.writeHead(200).end("You're on HomePage");
                case '/contact-us' :
                    return res.writeHead(200).end("Contact-us: Email : abhikr954614@gmail.com \n phone: 7856831085");
                case '/tweet' :
                    return res.writeHead(200).end("Tweet-1 \n Tweet-2");
            }
            break;
        }
        
        case 'POST' : {
            switch(path){
                case '/tweet' :
                    return res.writeHead(201).end("You are tweeted succesfully");
            }
        }

        default :
            return res.writeHead(404).end("Hey You are Lost");
    }
    
});

const PORT = 8000;
server.listen(PORT,()=>{
    console.log(`Your server is running at: ${PORT}`);
})