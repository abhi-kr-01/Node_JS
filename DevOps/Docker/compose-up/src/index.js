import http from "http";
import pg from "pg";
import { Redis } from "ioredis";
import { app } from "./app/server.js";
// # to run the typescript :
// 1. you have to build : npm run build 
// 2. npm start
async function init() {
    try {
        //redis connection
        console.log("Connecting Redis...");
        const redis = new Redis("http://localhost:6739", { lazyConnect: true });
        await redis.connect();
        console.log("connection success...");
        const { Client } = pg;
        const client = new Client({
            host: "localhost",
            port: 5432,
            database: "postgress",
            user: "postgress",
            password: "postgress"
        });
        await client.connect();
        console.log("Postgress connection successful...");
        const PORT = 8000;
        const server = http.createServer(app);
        server.listen(PORT, () => { console.log(`HTTP server is listening on PORT ${PORT}`); });
    }
    catch (error) {
    }
}
//# sourceMappingURL=index.js.map