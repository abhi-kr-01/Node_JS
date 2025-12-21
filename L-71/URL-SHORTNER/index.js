import express from "express";
import userRouter from './routes/user.routes.js'
import urlRouter from './routes/url.route.js';
import { authentcationMiddleware } from './middleware/auth.middleware.js'

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(authentcationMiddleware);
app.use(urlRouter);
app.use("/user",userRouter);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));