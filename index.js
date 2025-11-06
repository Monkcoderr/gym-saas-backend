// import express from 'express';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';

// dotenv.config();

// const port = process.env.PORT

//  const app = express()

// app.get('/', (req, res) => {
//   res.json({ 
//     message: "Database is connected!" 
//   });
// });


//  mongoose.connect(process.env.MONGO_URI).then(()=>{
//     console.log("Success")
//     app.listen(port,()=>{
//         console.log("fgdfgf")
//     })}
// ).catch((error)=>{console.error('MongoDB connection error:', error.message)
//     process.exit(1);})



import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // <-- 1. Import mongoose
import Member from './models/member.model.js';
import expressAsyncHandler from 'express-async-handler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;



app.use(express.json())

// --- 2. DEFINE YOUR ROUTES FIRST ---
// (We can add them back here)
app.get('/', (req, res) => {
  res.json({ 
    message: "Database is connected!" 
  });
});

app.get('/api/members' , expressAsyncHandler(async(res,req)=>{
const members = await Member.find({})
res.status(200).json(members)

}));



app.post('/api/members' , expressAsyncHandler(async(req, res)=>{
   const {name , email , phone , membershipPlan } = req.body;
   
   const memberExist = await Member.findOne({email});

   if(memberExist) {
    res.status(400);
    throw new Error('A member with this email already exists.');
   }

   const newMember = await Member.create({
    name,
    email,
    phone,
    membershipPlan,
   });

   if (newMember){
    res.status(201).json(newMember)
   } else{res.status(400);
    throw new Error('Invalid member data')
   }

}))


// --- 3. NEW DATABASE CONNECTION & SERVER START ---
// Try to connect to the database...
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // This code runs if the connection is SUCCESSFUL
    console.log('MongoDB connected successfully.');
    
    // Start the server ONLY AFTER the DB is connected
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  })
  .catch((error) => {
    // This code runs if the connection FAILS
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit the application with a failure code
  });

  







 







