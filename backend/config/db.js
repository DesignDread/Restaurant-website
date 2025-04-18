import mongoose from "mongoose";

export const  connectDB = async () =>{

    await mongoose.connect('mongodb+srv://restaurant:restaurant@cluster0.atag0em.mongodb.net/').then(()=>console.log("DB Connected"));
   
}