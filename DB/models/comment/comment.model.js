import mongoose from "mongoose";


const commentSchema = new mongoose.Schema(
    {
        text:{type:String, required:true},
        user_id:{type:mongoose.Schema.Types.ObjectId , required:true ,ref:'user'},
        postId :{type:mongoose.Schema.Types.ObjectId , required:true , ref:"post"},
        likes:[{type:mongoose.Types.ObjectId , ref:'user'}],
        unlikes:[{type:mongoose.Schema.Types.ObjectId , ref:'user'}],
        is_deleted:{type:Boolean , default:false}        
    },{timestamps:true});

export const commentModel = mongoose.model("comment" , commentSchema);    