import mongoose from "mongoose";

export const connection =async () =>
{
    return await mongoose.connect(process.env.connectionUri)
    .then(res=>console.log("database connected"))
    .catch(res=>console.log("database connection error")) 
}