import { userModel } from "../../../DB/models/user/user.model.js";
import {StatusCodes,getReasonPhrase} from "http-status-codes"

export const getUser = async(req,res)=>
{
    try 
    {
         let {userid}=req.params;

         let user = await userModel.findById(userid).populate(
            [
                {
                    path:"userPost"
                },
                {
                    path:"userComment"
                }
            ]
         );

         if (user) 
         {
            let state = StatusCodes.ACCEPTED;
            res.status(state).json({message:"done",user , status:getReasonPhrase(state)});

            
         }else
         {
            let state = StatusCodes.BAD_REQUEST;

            res.status(state).json({message:"invalid user" , status:getReasonPhrase(state)})
         }

         
         
    } catch (error) 
    {
        let state = StatusCodes.INTERNAL_SERVER_ERROR
        res.status(state).json({message:"error" , error , status:getReasonPhrase(state)});   
    }
}