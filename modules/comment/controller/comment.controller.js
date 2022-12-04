import {StatusCodes , getReasonPhrase} from "http-status-codes";
import {commentModel} from "../../../DB/models/comment/comment.model.js";
import { postModel } from "../../../DB/models/post/post.model.js";
import { userModel } from "../../../DB/models/user/user.model.js";

export const addComment = async(req,res)=>
{
    try 
    {
        let {postid} = req.params;
        let {userId} = req.currentUser._id;
        let {text} = req.body;
        
        let post = await postModel.findById(postid);
        if (post) 
        {
            let comment = new commentModel({text , user_id:req.currentUser._id , postId:postid});
            let addedComment = await comment.save();
            
            await postModel.findByIdAndUpdate(postid , 
                {
                    $push:{commentId:addedComment._id}
                },{new:true});
            await userModel.findByIdAndUpdate(userId , 
                {
                    $push:{userComment:addedComment._id}
                },{new:true});
            
            res.status(201).json({message:"done ",addedComment,status:getReasonPhrase(201)});    
        }else
        {
            let state = StatusCodes.BAD_REQUEST;

            res.status(state).json({message:"invalid postid" , status:getReasonPhrase(state)});

        }
    } catch (error) 
    {
        let state = StatusCodes.INTERNAL_SERVER_ERROR;
        res.status(state).json({message:"error" , error , status:getReasonPhrase(state)});   
    }
}