import express from 'express'

//Add something here

const app = express();

const PORT = process.env.PORT ? +process.env.PORT:800;

app.get('/',(req,res) => {
    res.json({
        status: 'success',
        message: "Hello from express erver"
    })
})

app.listen(PORT, () => console.log(`server started on PORT: ${PORT}`));