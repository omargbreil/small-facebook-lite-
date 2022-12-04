import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __direname = path.dirname(fileURLToPath(import.meta.url));

export const sendEmail = async(dest,message)=>
{
    let transporter = nodemailer.createTransport(
        {
            service:"gmail",
            port:587,
            secure:false,
            auth:
            {
                user:process.env.senderEmail,
                pass:process.env.senderPass
            }
        }
    );

    let info = await transporter.sendMail(
        {
            from:process.env.senderEmail,
            to: dest,
            html:message,
            text:"confirm",
            subject:"hi from nodemailer",
            attachments:
            [
                {
                    filename:"my picture",
                    path:'https://res.cloudinary.com/dhqe8isrb/image/upload/v1669682823/user/63839002041f51351a1417cd/powysfq7lhmmac7eek9k.jpg',
                    contentType:"image/jpg",
                },
                {
                    filename:"my Cv",
                    path: path.join(__direname, `../uploads/OmargbreilCV.docx`),
                    contentType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    
                }
                

            ]
        }
    );
};
 