import { ApiResposne } from '../utils/api.response.js';
import { asyncHandler } from '../utils/async-handler.js';

// const healthCheck = (req,res,next) => {
//     try {
//         res.status(200).json(
//             new ApiResposne(200, {message: "Server is Running"})
//         )
//     } catch (error) {
//         next(error);
//     }
// }

const healthCheck = asyncHandler(async (req,res)=>{
    res
        .status(200)
        .json(new ApiResposne(200,{message: "Server is still Running"}))
});

export { healthCheck };