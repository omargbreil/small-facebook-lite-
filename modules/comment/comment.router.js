import { Router } from "express";
import * as controller from "./controller/comment.controller.js";
import {auth} from "../../middleware/auth.middleware.js";



export const commentRouter = Router();

commentRouter.post("/addcomment/:postid" ,auth() , controller.addComment);