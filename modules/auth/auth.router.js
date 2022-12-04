import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { signUpSchema } from "./auth.validation.js";
import * as controller from "./controller/auth.controller.js"
export const authRouter = Router();


authRouter.post("/signup" ,validation(signUpSchema),controller.signUp);
authRouter.get("/confirmEmail/:token" , controller.confirmEmail);
authRouter.post("/signin" , controller.signIn);


