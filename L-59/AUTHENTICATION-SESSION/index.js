import express from 'express';
import userRouter from './routes/user.routes.js'
import db from "./db/index.js";
import { userTable, userSession }  from "./db/schema.js";
import { eq } from 'drizzle-orm';
import { error } from 'node:console';
import jwt from 'jsonwebtoken';
import adminRouter from "./routes/admin.routes.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());  // telling express to use a middleware that 
// can parse incoming json request bodies

app.use(async function (req,res,next){
    // const sessionId = req.headers["session-id"];
    //after using jwt

    const tokenHeader = req.headers['authorization'];

    // Header authorization: Bearer <TOKEN>


    if(!tokenHeader){
        // user not loged in 
        return next();
    }

    // after using jwt this thing u have to do
    if(!tokenHeader.startsWith('Bearer')){
        return res.status(400).json({
            error: "authorization headers must start with Bearer"
        })
    }

    const token = tokenHeader.split(' ')[1];
    const decoded = jwt.verify(token,process.env.JWT_SECRET);


    // const [data] =  await db.select(
    //     {
    //     sessionId: userSession.id,
    //     id: userTable.id,
    //     userId: userSession.userId,
    //     name: userTable.name,
    //     email: userTable.email
    //     }
    // ).from(userSession)
    // .rightJoin(userTable, eq(userTable.id,userId))
    // .where(table => eq(table.id , sessionId));

    // if(!data){
    //     return next();
    // }

    // req.user = data;

    //after using jwt 
    req.user = decoded
    next();
    //when we run code and when we give wrong token then server will crash
    //to solve this we have to use try{}catch(err){next()} from prevention of server crash
})

app.get('/',(req,res)=>{
    return res.json({status : 'server is up and running'});
});

app.use('/user',userRouter);
app.use('/admin',adminRouter);

app.listen(PORT, ()=> console.log(`server started is running at ${PORT}`));