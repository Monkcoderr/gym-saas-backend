import bcrypt from "bcryptjs";

const runTest = async()=>{

const myPassword = "123456789"
 
const salt = await bcrypt.genSalt(10);
console.log('my salt ',salt);

const hashedPassword = await bcrypt.hash(myPassword,salt)
console.log('Original Password:', myPassword);
    console.log('Hashed Password:', hashedPassword);

    const isMatchGood = await bcrypt.compare(myPassword, hashedPassword);
    console.log('Did "password123" match? ->', isMatchGood); // Should be true

    // 4. Compare a BAD password
    const isMatchBad = await bcrypt.compare('wrongpassword', hashedPassword);
    console.log('Did "wrongpassword" match? ->', isMatchBad); // Should be false



}
runTest()