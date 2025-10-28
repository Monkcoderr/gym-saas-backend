import express from 'express';
 const app = express()

 

app.get('/',(req , res)=>{
    res.send("chut mari ke")
})




app.listen(port,()=>{
    console.log("chut mari ke")
})

