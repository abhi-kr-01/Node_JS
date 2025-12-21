const fs= require('fs'); // or node:fs

// const content = fs.readFileSync('notes.txt','utf-8');

// console.log(content); 

fs.writeFileSync("copy.txt","I want to copy this ","utf-8");//it always overwrite this content

//for append use 
fs.appendFileSync('copy.txt','\n I am append this line','utf-8');

//for mkdir
fs.mkdirSync('games');
// for recursive games/abc/xyz we use
fs.mkdirSync('game/abc/xyz',{recursive:true});

//for remove dir --> we cannot remove dir in which some content is available 
//so we remove it one by one "rmdirSync"


//to delete file unlink();