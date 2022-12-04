import { Router } from "express";
import {auth} from "../../middleware/auth.middleware.js";
import { multerHandleError, myMulter, validationTypes } from "../../services/multer.js";
import * as controller from "./controller/post.controller.js"

export const postRouter = Router();

postRouter.post("/addpost" ,auth(),myMulter(validationTypes.image).single("post_img"), multerHandleError() ,controller.addPost)
postRouter.patch("/likepost/:postId" , auth() , controller.likePost);
postRouter.patch("/unlikepost/:postId" , auth() , controller.unlikePost);
postRouter.get("/getpost/:postid" , controller.getPost);