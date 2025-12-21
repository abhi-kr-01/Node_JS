//   it is only entry ppoint of the project
import 'dotenv/config';
import app from './app.js';
import connectDB from './db/index.js';

const PORT = process.env.PORT ?? 8001;

connectDB()
.then(() => {
    app.listen(PORT,()=> console.log(`your server is running at http://localhost:${PORT} `));
})
.catch((err) => {
    console.error("MongoDB connection error:" , err);
    process.exit(1);
});


