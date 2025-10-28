import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT

 const app = express()

 

app.get('/',(req , res)=>{
    res.send("chut mari ke",port)
})




app.listen(port,()=>{
    console.log("chut mari ke",port)
})

