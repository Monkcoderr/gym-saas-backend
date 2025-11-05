// import mongoose from "mongoose";

// const memberSchema = new mongoose.Schema({
//     name : {
//         type : String,
//         required : [true,"member name is required"],
//         trim : true
//     },
    
// },
// {
//     timestamps : true
// }

// const Member = mongoose.model('Member',memberSchema);
  
// export default Member










// )
import mongoose from 'mongoose';

// 1. This is the "blueprint" (Schema)
const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true, // This removes any extra spaces at the beginning or end
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // This makes sure no two members can have the same email
      lowercase: true, // This converts the email to lowercase before saving
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    membershipPlan: {
      type: String,
      required: [true, 'Membership plan is required'],
      enum: ['Monthly', 'Quarterly', 'Annual', 'Trial'], // Only allows these values
    },
    // This adds "createdAt" and "updatedAt" fields automatically!
  },
  {
    timestamps: true,
  }
);

// 2. This is the "factory" (Model)
// We are telling Mongoose: "Create a model called 'Member' based on the 'memberSchema'"
const Member = mongoose.model('Member', memberSchema);

// 3. Export the model
export default Member;

