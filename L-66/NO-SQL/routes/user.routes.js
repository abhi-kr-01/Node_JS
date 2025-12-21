import  express from "express";
import { User } from '../models/user.model.js'
import { randomBytes, createHmac } from 'node:crypto';
import { error } from "node:console";
import jwt  from 'jsonwebtoken';
import { authMiddleware, ensureAuthenticated} from '../middlewares/user.middlewares.js'


const router = express.Router();

router.patch('/', ensureAuthenticated ,async (req,res) => {
    const { name } = req.body;

    await User.findByIdAndUpdate(req.user._id,{
        name,
    });

    return res.json({status: 'success'});
});

router.post('/signup',async (req,res)=>{
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
        email,
    });

    if(existingUser){
        return res.status(400).json({
            error: `User with ${email} already exist`
        });
    }

    const salt = randomBytes(256).toString('hex');
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

    const user = await User.insertOne({
        name,
        email,
        password: hashedPassword,
        salt,
    });

    return res.status(201).json({status: 'success', data: { id: user._id }})
})
//mongodb create each data has unique id that is _id;


router.post('/login', async ( req, res ) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if(!existingUser){
        return res.status(401).json({
           error: `user with this ${email } does not exist`
        })
    }

    const salt = existingUser.salt;
    const hashed = existingUser.password ;

    const newHash = createHmac('sha256' , salt).update(password).digest('hex');

    if(newHash !== hashed){
        return res.status(400).json(
            {error: `Entered password is wrong`}
        )
    }

    //for webToken

    const payLoad = {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
    };

    const token = jwt.sign(payLoad, process.env.JWT_SECRET);

    return res.json({status: "success",token})

});


export default router;