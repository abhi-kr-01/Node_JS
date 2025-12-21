import express from 'express';
import { signupPostRequestBodySchema, loginPostRequestBodySchema } from '../validation/request.validation.js';
import { hashPasswordWithSalt } from '../utils/hash.js'
import { getUserByEmail, createUser } from '../services/user.service.js'
import { createUserToken } from '../utils/token.js';

const router = express.Router();

// router.post('/signup', async (req,res) => {
//     const { firstname, lastname, email, password} = req.body;

//     if(!firstname) {
//         return res.status(400).json({error: "You must fill firstname"});
//     }

//     const [existingUser] = await db.select(
//        { id: usersTable.id}
//     ).from(usersTable).where(eq(usersTable.email , email ));

//     if(existingUser){
//         return res.status(400).json({error : 'This email already exist'});
//     }

//     const salt = randomBytes(256).toString('hex');

//     const hashedPassword = createHmac('sha256',salt).update(password).digest('hex');

//     const [user] = await db.insert(usersTable).values({
//         email,
//         firstname,
//         lastname,
//         salt,
//         password: hashedPassword
//     }).returning({ id : usersTable.id});

//     return res.status(201).json( {data : { userId : user.id} })
// })

router.post('/signup', async (req,res) => {
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

    if(validationResult.error){
        return res.status(400).json({ error : validationResult.error.format()});
    }

    const { firstname, lastname, email, password } = validationResult.data

    const existingUser = await getUserByEmail(email);

    if(existingUser){
        return res.status(400).json({error : 'This email already exist'});
    }

    const { salt, hashedPassword } = hashPasswordWithSalt(password);

    const user = await createUser(email ,firstname, lastname, salt, hashedPassword)

    return res.status(201).json( {data : { userId : user.id} })
})

router.post('/login',async (req,res) => {
    const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body);

    if(validationResult.error){
        return res.status(401).json({ error: validationResult.error.format()});
    }

    const { email , password} = validationResult.data;

    const user = await getUserByEmail(email);

    if(!user){
        return res.status(401).json({error: `user with ${email} is already exist`});
    }

    const { hashedPassword } = hashPasswordWithSalt(password, user.salt);

    if(user.password !== hashedPassword){
        return res.status(400).json({error: 'Invalid password'});
    }

    // if it is correct then generate token for him

    //const token = jwt.sign({ id: user.id},process.env.JWT_SECRET);
    const token = await createUserToken({id: user.id});

    return res.json({ token });
})

export default router;