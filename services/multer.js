import multer from "multer";
import {nanoid} from "nanoid";
import {StatusCodes , getReasonPhrase} from "http-status-codes";
// import fs from "fs";
// import path from "path";
// import {fileURLToPath} from "url";



export const  validationTypes =
{
    image : ['image/png' , 'image/jpg' , 'image/jpeg'],
    pdf :"application/pdf"
} 



export const multerHandleError =()=>
{
    return (err,req,res,next)=>
    {
        try 
        {
            if (err) 
            {
                let state = StatusCodes.BAD_REQUEST;
                res.status(state).json({message:"invalid type" , err , status:getReasonPhrase(state)})   
            }else
            {
                next()
            }
            
        } catch (error) 
        {

            let state = StatusCodes.INTERNAL_SERVER_ERROR;

            res.status(state).json({message:"multer hundel error" , error , status:getReasonPhrase(state)})
                
        }
    }
}
export const  myMulter = (validationTypes , customPath)=>
{
    // if (!customPath) 
    // {
    //     customPath="general"    
    // }
    // const _direname = path.dirname(fileURLToPath(import.meta.url));

    // const fullPath = path.join(_direname ,`../uploads/${customPath}`)
  

    // if (!fs.existsSync(fullPath)) 
    // {
    //     fs.mkdirSync(fullPath,{recursive:true})
        
    // }

     const storage = multer.diskStorage(
        {
            // destination:function(req,file,cb) 
            // {
            //     cb(null ,`uploads/${customPath}`)
                
            // },
            // filename:function (req,file,cb) 
        // {
            //     cb(null , nanoid()+"-"+file.originalname);
    
    
            // }
    
        }
    )

    function fileFilter(req,file,cb) 
    {
        if (validationTypes.includes(file.mimetype)) 
        {
          cb(null, true)  

        }else
        {
            cb('invalid type' , false)
        }
    }
    const upload = multer({storage , fileFilter})
        return upload
}