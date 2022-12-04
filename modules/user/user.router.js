import { Router } from "express";
import * as controller from "./controller/user.controller.js";


export const userRouter = Router();

userRouter.get("/getuser/:userid" , controller.getUser);