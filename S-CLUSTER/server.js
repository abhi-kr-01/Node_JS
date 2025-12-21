const cluster = require('node:cluster');
const os =  require('os');  // it tells total number of CPU in pc;
const express = require('express');

const totalCPUs = os.cpus().length;

if(cluster.isPrimary){
    console.log(`Primary ${process.pid} is running`);

    // fork workser
    for(let i =0 ;i< totalCPUs; i++){
        cluster.fork();
    }
}
else{   
    const app = express();
    const PORT = 8000;
    
    app.get("/",(req,res) => {
        return res.json({
            message: `Hello from Express Server ${process.pid}`
        })
    });

    app.listen(PORT, () => console.log(`server startes at PORT: ${PORT}`));
}