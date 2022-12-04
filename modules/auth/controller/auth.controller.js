import { userModel } from "../../../DB/models/user/user.model.js";
import bcrypt from "bcryptjs";
import  jwt  from "jsonwebtoken";
import { sendEmail } from "../../../services/sendEmail.js";
import {ReasonPhrases,StatusCodes,getReasonPhrase,getStatusCode,} from 'http-status-codes';




export const signUp = async(req,res)=>
{
    try 
    {
        let {user_name , email , password , cpassword} = req.body;

        let user = await userModel.findOne({email});
        if (user) 
        {
            let state=StatusCodes.BAD_REQUEST
            res.status(state).json({message:"you already register" , status:getReasonPhrase(state)});   
        }else
        {
            const hashed = bcrypt.hashSync(password , parseInt(process.env.salt));
            
            let savedUser = new userModel({user_name , email , password:hashed});
            let addedUser = await savedUser.save();
            let token = jwt.sign({email ,id:addedUser._id} ,process.env.confirmEmailKey , {expiresIn:60*60});
            let link = `${req.protocol}://${req.headers.host}${process.env.baseUrl}auth/confirmEmail/${token}`
            let message = ` click to verify your email <a href="${link}"> click here </a>`
            
            sendEmail(email,message);
            let state =StatusCodes.CREATED
            res.status(state).json({message:"done" , addedUser , status:getReasonPhrase(state)});
        }
        
    }catch (error) 
    {
        let state=StatusCodes.INTERNAL_SERVER_ERROR
        res.status(state).json({message:"error" , error , status:getReasonPhrase(state)})
    }
}

export const confirmEmail = async(req,res)=>
{
    try 
    {

        let {token}= req.params;

        let decoded = jwt.verify(token , process.env.confirmEmailKey);
      
        if (decoded) 
        {
            let user = await userModel.findById(decoded.id);
            if (user) 
            {
                if (user.is_confirmed) 
                {
                    let state = StatusCodes.BAD_REQUEST
                    res.status(state).json({message:"your email is already confirmed",status:getReasonPhrase(state)});
                }else
                {
                    let updatedUser = await userModel.findByIdAndUpdate(user._id , 
                        {
                            is_confirmed:true
                        },{new:true});
                        let state=StatusCodes.CREATED
                        res.status(state).json({message:"done" , updatedUser,status:getReasonPhrase(state)})
                }

            }    
        }else
        {
            let state = StatusCodes.BAD_REQUEST
            res.status(state).json({message:"invalid id", status:getReasonPhrase(state)});
        }
        
    } catch (error) 
    {
        let state = StatusCodes.INTERNAL_SERVER_ERROR
        res.status(state).json({message:"error", error,status:getReasonPhrase(state)})   
    }
}

export const signIn = async (req,res)=>
{
    try 
    {
        let {email , password} = req.body;
        let user = await userModel.findOne({email});
        if (user) 
        {
            let matched =bcrypt.compareSync(password, user.password);
            if (matched) 
            {
                if (user.is_confirmed) 
                {
                    let token = jwt.sign({email,id:user._id , isLogin:true},process.env.tokenKey,{expiresIn:60*60*24});
                    let state=StatusCodes.ACCEPTED
                    res.status(state).json({message:"done" ,token , status:getReasonPhrase(state)})
                    
                }else
                {
                    let state =StatusCodes.BAD_REQUEST

                    res.status(state).json({message:"you have to confirm your email",status:getReasonPhrase(state)})
                }   
            }else
            {
                let state =StatusCodes.BAD_REQUEST

                res.status(state).json({message:"incorrect password" , status:getReasonPhrase(state)});
            }
            
        } else 
        {
            let state =StatusCodes.BAD_REQUEST
            res.status(state).json({message:"you have to register" , status:getReasonPhrase(state)});    
        }


        
    } catch (error) 
    {
        let state=StatusCodes.INTERNAL_SERVER_ERROR;
        res.status(state).json({message:"error" , error, status:getReasonPhrase(state)});   
    }
}
