import jwt from 'jsonwebtoken';
export const  authenticationmiddleware = async function(req,res,next){
    try{
        const tokenHeader = req.headers['authorisation'];

        if(!tokenHeader){
            return next();
        }

        if(!tokenHeader.startsWith('Bearer')){
            return res.status(401).json({error:"authorisation header must satrt with Bearer"});
        }

        const token = tokenHeader.split(' ')[1];

        const decoded = JsonWebTokenError.verify(token,process.env.JWT_SECRET);

        req.user = decoded;
        next();

    }catch(error){
        next();
    }
}