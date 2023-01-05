import { userModel } from "../../../../DB/models/user/user.model.js";
import  bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {sendEmail} from "../../../../service/sendemail.js"

export const signUp =async(req,res)=>
{
  
    try 
    {
        let{first_name,last_name , email , password , age} = req.body;

        const user = await userModel.findOne({email});
        
        if (!user) 
        {
            let hashed = bcrypt.hashSync(password , parseInt(process.env.saltRound));
            let addUser = new userModel({first_name,last_name , email , password:hashed , age});

            let token = jwt.sign({id:addUser._id , email:email} , process.env.signatureToken , {expiresIn:"1hr"});
            let link =`${req.protocol}://${req.headers.host}${process.env.baseUrl}/user/confirmEmail/${token}`;

            let message = `verify your email <a href="${link}">click here</a>`;

            let result =await sendEmail(email , message);

            

            
            if (result.accepted.length) 
            {
                let savedUser = await addUser.save();
                res.status(201).json({message:"done" , savedUser});
            }else
            {
                res.status(404).json({message:"invalid email"});
            
            }
        }else
        {
            res.status(409).json({message:"email already register" , status:409});
        }
        
    
        
    } catch (error) 
    {
        res.json({message:error})    
    }

       
}


        
    




export const confirmEmail =async(req,res)=>
{
    try 
    {
        let {token} = req.params;

        let decoded = jwt.verify(token , process.env.signatureToken);
        if (!decoded) 
        {
            res.status(400).json({message:"invalid token"});
        }else
        {
            let update = await userModel.findByIdAndUpdate(decoded.id,
                {
                    is_confirmed:true
                },{new:true});
    
                if (update) 
                {
                    res.redirect('https://omargbreil.github.io/noxe/login');
                }else
                {
                    res.status(400).json({message:"error"});
    
                
                }
        }

    } catch (error) 
    {
        res.status(404).json({message:error})    
    }
}
 
  
   
 


export const signIn =async(req,res)=>
{   
    
    try 
    {
        let {email , password } = req.body;

        let user = await userModel.findOne({email});

        if (user) 
        {
            let comparePassword = bcrypt.compareSync(password , user.password);
            if (comparePassword) 
            {
                if (user.is_confirmed) 
                {
                    let token = jwt.sign({id:user._id , isLoggedIn:true , email:email} , process.env.emailToken , {expiresIn:"1hr"});
                    res.status(200).json({message:"done" , token});
                    res.redirect('https://omargbreil.github.io/noxe/');

                }else
                {
                    res.status(400).json({message:"you have to confirm your email"});

                }

                
            }else
            {
                res.status(403).json({message:"incorrect password"}); 
            }   
        }else
        {
            res.status(404).json({message:"you have to register"});
            
        }
        
    
        
    } catch (error) 
    {
        res.status({message:error})    
    }
        
};
