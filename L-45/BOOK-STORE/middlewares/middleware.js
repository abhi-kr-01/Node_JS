exports.middleware = function(req,res,next){
    console.log("hey, I am a middleware");
    next();
}