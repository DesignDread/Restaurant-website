import mongoose from "mongoose";

export const  connectDB = async () =>{

    await mongoose.connect('mongodb+srv://raghav:raghavsinglamongodb@cluster0.9tsqoye.mongodb.net/food-del').then(()=>console.log("DB Connected"));
   
}