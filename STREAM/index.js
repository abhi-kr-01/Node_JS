import express from 'express'
import fs from 'fs';
import status from 'express-status-monitor';
import zlib from 'zlib';

const app = express();
const PORT=8000;

app.use(status());

app.get("/",(req,res) => {
    // fs.readFile("./sample.txt",(err,data) => {
    //     res.end(data);
    // });   -- this method first store complete file in our storage
    // then it send to frontend. It uses more storage not good practice

    // to resolve this issue we make file into large number of smaller size of chunks ad send repeatedly
    // again and again  -- this is called stream
    // nodejs supports stream
    
    // make stream readstream using "createReadStream()";
    const stream = fs.createReadStream("./sample.txt","utf-8");

    stream.on('data',(chunk) => res.write(chunk));   // collect data in form of chunk and write it
    // that means we don't store chunks it write data when chunks collect 
    stream.on("end",()=>res.end());   // if completed it's end it
    
});

// IF WE WILL COMPRESS DATA IN ZIP FOLDER AND WRITE ALL DATA ON FRONTEND
// then issue will not resolve b/c of size issue
// 400MB file -> 400MB(ZIP) -> 400MB Write 

// make zip file/folder without memory using
// import buildin lib "zlib" from "zlib" from nodeJS
// stream Read (sample.txt) -> zipper -> fs Write stream 
fs.createReadStream('./sample.txt').pipe(zlib.createGzip().pipe(fs.createWriteStream("./sample.zip")));
// ".pipe() -- data send to _ from 'sample.txt' ";

app.listen(PORT,()=> (console.log(`server is running at http://localhost:${PORT}`)))