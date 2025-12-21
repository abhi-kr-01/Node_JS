const {Buffer} = require("node:buffer");

// const buf = Buffer.alloc(4);  ///initialised memory with "0"
// console.log(buf); //buf return in uint8 Array
// console.log(buf[1]);

// const buf = Buffer.from("Hello World");
// console.log(buf);  //<Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
// console.log(buf.toString()); /// Hello World

// const buf2 = Buffer.allocUnsafe(10);  // uninitialised memory 
// console.log(buf2);

//fill(val)  ->you can fill the data with initialised valuw with val;

// const buf = Buffer.alloc(10);
// buf.write('Hello');
// console.log(buf.toString());

//modifying the value
// const buf = Buffer.from("abhishek");
// console.log(buf);
// console.log(buf.toString());
// buf[0] = 0x49;
// console.log(buf);
// console.log(buf.toString());

//concatinate 
// const buf1 = Buffer.from('Hello ');
// const buf2 = Buffer.from('World');
// const merge = Buffer.concat([buf1,buf2]);
// console.log(merge.toString());
// console.log(merge.length);
