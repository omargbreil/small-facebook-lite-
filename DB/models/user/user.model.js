import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        user_name:String,
        email:{type:String,required:true},
        password:{type:String,required:true},
        userPost:[{type:mongoose.Schema.Types.ObjectId ,ref:"post"}],
        userComment:[{type:mongoose.Schema.Types.ObjectId , ref:"comment"}],
        profile_pic : String,
        cover_pic : Array,
        code:String,
        is_confirmed:{type:Boolean,default:false}
    },{timestamps:true});

    export const userModel = mongoose.model("user" ,userSchema);
