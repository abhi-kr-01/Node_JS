import 'dotenv/config';
import express from 'express'
import { connectMOngoDB } from './connection.js';
import userRouter from './routes/user.routes.js'
import { authMiddleware }  from './middlewares/user.middlewares.js'

const app = express();
const PORT = process.env.PORT ?? 8000 ;

//for mongoDB connection
connectMOngoDB(process.env.MONGODB_URL).then(()=>console.log(`Mongo DB connected`));

app.use(express.json());
app.use(authMiddleware);

app.use('/user',userRouter);

app.listen(PORT, ()=> console.log(`Your server is running at ${PORT} `));