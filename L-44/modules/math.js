// function add(a,b){
//     return a+b;
// }

// function sub(a,b){
//     return a-b;
// }
// function mul(a,b){
//     return a*b;
// }
// function div(a,b){
//     return a/b;
// }

// if all this will call then it will not work


//Now it will work

exports.add =  function add(a,b){
    return a+b;
}

exports.sub = function sub(a,b){
    return a-b;
}
exports.mul=function mul(a,b){
    return a*b;
}
exports.div = function div(a,b){
    return a/b;
}


/// default export

module.exports = function(){
    console.log('Hey, i am default ');
};