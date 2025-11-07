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
import User from './models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { protect } from './middleware/auth.middleware.js';


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

app.get('/api/members' , protect ,expressAsyncHandler(async(req , res)=>{
const members = await Member.find({})
res.status(200).json(members);

}));



app.post('/api/members' , protect, expressAsyncHandler(async(req, res)=>{
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



app.put('/api/members/:id', protect, expressAsyncHandler(async(req, res)=>{
  const member = await Member.findById(req.params.id);
 
  if (!member){
    res.status(404);
    throw new Error('member not found')
  }
  
  const updatedMember = await Member.findByIdAndUpdate(req.params.id,
    req.body,
    {
      new : true ,
      runValidators : true
    }
  );
  res.status(200).json(updatedMember);
}));



app.delete('/api/members/:id', protect, expressAsyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }

  await Member.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Member removed', id: req.params.id });
}));


app.post('/api/users/register',expressAsyncHandler(async(req,res)=>{

  const { name , email, password } = req.body;
  
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('User with this email already exists.');
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data.');
  }

}))

app.post('/api/users/login', expressAsyncHandler(async(req, res)=>{
  const {email, password} = req.body;
  const user = await User.findOne({email})
   
  if (user && (await user.matchPassword(password))) {

    const token = jwt.sign(
      {id : user._id},
      process.env.JWT_SECRET,
      {expiresIn:'30d'}
    )
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });
  }else {
    // 4b. If user or password is bad, send '401 Unauthorized'
    res.status(401); // 401 means "Unauthorized"
    throw new Error('Invalid email or password');
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

  







 







