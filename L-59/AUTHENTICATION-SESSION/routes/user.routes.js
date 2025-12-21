import  express  from 'express';
import db from "../db/index.js";
import { userTable, userSession }  from "../db/schema.js";
import { eq } from 'drizzle-orm';
import { randomBytes , createHmac } from 'node:crypto';
import { table } from 'node:console';
import { stat } from 'node:fs';
import jwt from 'jsonwebtoken';

const router = express.Router();

//lets say an user have to update something from current logged in 
// router.patch('/', async(req,res)=>{
//     const {name} = req.body;

//  //   then we have to repeat the code written below
//  //to solve this i create middleware-> for fetching the session and keeping in the data 
//  //of the session ant then forward the req to the routes
// })

router.patch('/',async (req,res) => {
    const user = req.user

    if(!user){
        return res.status(401).json({
            error: "You are not logged In"
        })
    }

    const { name } = req.body;

    await db.update(userTable).set({
        name
    }).where(eq(userTable.id, user.id));

    return res.json({status: 'success'});

})


router.get('/',async (req,res)=>{

    const user = req.user;

    if(!user){
        return res.status(401).json({
            error: 'You are not loggeed In'
        })
    }

    return res.json({user});

}); //returns current logedIn user

router.post('/signup',async (req,res)=>{

    const { name, email, password} = req.body;

    const [existingUser] = await db.select({
        email: userTable.email,
    })
    .from(userTable)
    .where(table => eq(table.email,email));

    if(existingUser){
        return res.status(400)
        .json({error: `user withemail ${email} already exists!`});
    }

    //we can not insert pass in db to solve this we will 
    // add salt on it to keep safe using node:crypto

    const salt = randomBytes(256).toString('hex'); //this is secret of passwd

    const hashedPassword = createHmac('sha256',salt)
    .update(password).digest('hex');              // this step is in-build for hashing with passwd and salt 

    const [user] = await db.insert(userTable)
    .values({
        name,
        email,
        password: hashedPassword,
        salt,
    }).returning({id: userTable.id });

    res.status(201).json({ status : 'success', data: { userId : user.id }});

});  // signup


// router.post('/login',async (req,res)=>{

//     const { email, password} = req.body;

//     const [existingUser] = await db.select({
//         id: userTable.id,
//         email: userTable.email,
//         salt: userTable.salt,
//         password: userTable.password,
//     })
//     .from(userTable)
//     .where(table => eq(table.email,email));

//     if(!existingUser){
//         return res.status(404).json({
//             error: `user with email ${email} doen not exist!`
//         });
//     }

//     const salt = existingUser.salt;

//     const existinhHash = existingUser.password;

//     //new hash
//     const newHash = randomBytes(256).toString('hex'); //this is secret of passwd

//     const newhashedPassword = createHmac('sha256',salt)
//     .update(password).digest('hex');   
    
//     if(newhashedPassword !== existinhHash){
//         return res.status(400).json({
//             error:`You entered wrong password`
//         })
//     }

//     //generate seesion for user and return res

//     const [session] = await db.insert(userSession)
//     .values({
//         userId: existingUser.id
//     }).returning({ id: userSession.id });

//     return res.status(200).json({status: 'success',sessionId: session.id});
//     //what i have done in this is technically not correct 
//     //bcz loged in means generate tokens/session for user after loged IN

//     //session can be create in db

//});  // login

//now we will create token when user is log in
router.post('/login',async (req,res)=>{

    const { email, password} = req.body;

    const [existingUser] = await db.select({
        id: userTable.id,
        email: userTable.email,
        salt: userTable.salt,
        password: userTable.password,
    })
    .from(userTable)
    .where(table => eq(table.email,email));

    if(!existingUser){
        return res.status(404).json({
            error: `user with email ${email} doen not exist!`
        });
    }

    const salt = existingUser.salt;

    const existinhHash = existingUser.password;

    //new hash
    const newHash = randomBytes(256).toString('hex'); //this is secret of passwd

    const newhashedPassword = createHmac('sha256',salt)
    .update(password).digest('hex');   
    
    if(newhashedPassword !== existinhHash){
        return res.status(400).json({
            error:`You entered wrong password`
        })
    }

    //generate token for user and return res

   const payload = {
    id: existingUser.id,
    email: existingUser.email,
    name: existingUser.name
   }

   const token = jwt.sign(payload, process.env.JWT_SECRET,{ expiresIn: '1m'});  // this create token 

   return res.json({status:'success',token});


    //session can be create in db

});  // login

export default router;