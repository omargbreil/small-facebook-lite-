import mongoose from "mongoose";


const postSchema = new mongoose.Schema(
    {
        caption:String,
        post_img:{type:String,required:true},
        user_id:{type:mongoose.Schema.Types.ObjectId , required:true ,ref:'user'},
        likes:[{type:mongoose.Schema.Types.ObjectId , ref:'user'}],
        unlikes:[{type:mongoose.Schema.Types.ObjectId , ref:'user'}],
        commentId:[{type:mongoose.Schema.Types.ObjectId , ref:'comment'}],
        total_count:{type:Number , default:0}
        
    },{timestamps:true});

export const postModel = mongoose.model("post" , postSchema);    