const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise
        .resolve(requestHandler(req,res,next))
        .catch( (err) => next(err));
    };
}

// This asyncHandler function is higher order function in which we pass function as argument 
// also return function 

export { asyncHandler };