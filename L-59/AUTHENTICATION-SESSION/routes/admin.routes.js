import  express  from 'express';
import db from '../db/index';
import { userTable } from '../db/schema';

const router = express.Router();

router.get('/users',async(req,res)=>{

    if(!req.user){
        return res.status(401).json({error:"You must be authenticated for access this"});
    }

    

    const [ users ] = await db.select({
        id: userTable.id,
        email:userTable.email,
        name: userTable.name
    })
    .from(userTable);

    return res.json({users});
})

export default router;
