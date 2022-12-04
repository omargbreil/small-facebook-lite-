import { postModel } from "../../../DB/models/post/post.model.js";
import {StatusCodes , getReasonPhrase} from "http-status-codes";
import cloudinary from "../../../services/cloudinary.js";
import { userModel } from "../../../DB/models/user/user.model.js";

export const addPost = async(req,res)=>
{
    try 
    {
        let {caption, post_img} = req.body;

        let uploadedImg = await cloudinary.uploader.upload(req.file.path,
            {
                folder:`user/${req.currentUser._id}`
            });

        let savedPost = new postModel({caption, post_img:uploadedImg.secure_url,user_id:req.currentUser._id});
        let addedPost = await savedPost.save();

        await userModel.findByIdAndUpdate(req.currentUser._id , 
            {
                $push:{userPost:addedPost._id}
            },{new:true})
            
        let state = StatusCodes.CREATED;

        res.status(state).json({message:"done" , addedPost , status:getReasonPhrase(state)});
    


    } catch (error) 
    {
        let state = StatusCodes.INTERNAL_SERVER_ERROR
     res.status(state).json({message:"error" , error , status:getReasonPhrase(state)})   
    }
} 

export const getPost = async(req,res)=>
{
    try 
    {
        let {postid}=req.params;

        let post = await postModel.findById(postid).populate(
            [
                {
                    path:"user_id"
                },
                {
                    path:"commentId"
                }
            ]);

        let state = StatusCodes.ACCEPTED
        res.status(state).json({message:"done" , post , status:getReasonPhrase(state)})
        
    } catch (error) 
    {
        let state = StatusCodes.INTERNAL_SERVER_ERROR
        res.status(state).res({message:"error" , error , status:getReasonPhrase(state)})    
    }
}

export const likePost = async(req,res)=>
{
    try 
    {

        let {postId} = req.params;

        
        
                 let Post = await postModel.findOne({_id:postId, likes:{$nin:[req.currentUser._id]}});
                 if (Post) 
                 {
                    let updatedPost = await postModel.findByIdAndUpdate(postId,
                        {
                            $push:{likes:req.currentUser._id},
                            $pull:{unlikes:req.currentUser._id},
                            $inc:{total_count:1}
                        },{new:true}).populate(
                            [
                                {
                                    path:"user_id"
                                },
                                {
                                    path:"commentId"
                                }
                            ]);
                
                        
                    let state = StatusCodes.ACCEPTED;
                    res.status(state).json({message:"done", updatedPost,status:getReasonPhrase(state)});
 
                 }else
                 {
                    let state =StatusCodes.BAD_REQUEST
                    res.status(state).json({message:"you already like it" , status:getReasonPhrase(state)})
                 }
       
       

        
    } catch (error) 
    {
        let state = StatusCodes.INTERNAL_SERVER_ERROR
        res.status(state).json({message:"error" , error , status:getReasonPhrase(state)})    
    }
}

export const unlikePost = async(req,res)=>
{
    try 
    {

        let {postId} = req.params;


        
                 let Post = await postModel.findOne({ _id:postId , unlikes:{$nin:[req.currentUser._id]}});
                 if (Post) 
                 {
                    let updatedPost = await postModel.findByIdAndUpdate(postId,
                        {
                            $push:{unlikes:req.currentUser._id},
                            $pull:{likes:req.currentUser._id},
                            $inc:{total_count: -1}
                        },{new:true}).populate(
                            [
                                {
                                    path:"user_id"
                                },
                                {
                                    path:"commentId"
                                }
                            ]);;
                        
                    let state = StatusCodes.ACCEPTED;
                    res.status(state).json({message:"done", updatedPost,status:getReasonPhrase(state)});
 
                 }else
                 {
                    let state =StatusCodes.BAD_REQUEST
                    res.status(state).json({message:"you already unlike it" , status:getReasonPhrase(state)})
                 }
       

        
    } catch (error) 
    {
        let state = StatusCodes.INTERNAL_SERVER_ERROR
        res.status(state).json({message:"error" , error , status:getReasonPhrase(state)})    
    }
}