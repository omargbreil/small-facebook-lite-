import  jwt  from "jsonwebtoken";
import {StatusCodes , getReasonPhrase} from "http-status-codes"
import { userModel } from "../DB/models/user/user.model.js";
export const auth =()=>
{
    return async(req,res,next)=>
    {
        try 
        {
            let {authorization} = req.headers;
           
            if (authorization.startsWith("Bearer")) 
            {
                let token = authorization.split(" ")[1];
                const decoded = jwt.verify(token , process.env.tokenKey);
                if (decoded) 
                { 
                    req.currentUser =await userModel.findById(decoded.id);
                    
                    next()   
                }else
                {
                    let state = StatusCodes.FAILED_DEPENDENCY;
                    res.status(state).json({message:"invalid token" , status:getReasonPhrase(state)});
                }
                
            }else
            {
                let state =StatusCodes.FAILED_DEPENDENCY
                res.status(state).json({message:"invalid token" , status:getReasonPhrase(state)})
            }
            
        } catch (error) 
        {
            let state=StatusCodes.INTERNAL_SERVER_ERROR;
            res.status(state).json({message:"invalid token" , status:getReasonPhrase(state)})
        }
    }
}