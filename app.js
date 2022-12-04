import dotenv from "dotenv";
dotenv.config({});
import express from "express";
import { connection } from "./DB/connection.js";
import * as Router from "./modules/index.routes.js";

const app = express();
app.use(express.json());

app.listen(parseInt(process.env.port) , ()=>console.log("server running"));
connection();

app.use(`${process.env.baseUrl}user` , Router.userRouter);
app.use(`${process.env.baseUrl}auth` , Router.authRouter);
app.use(`${process.env.baseUrl}post` , Router.postRouter);
app.use(`${process.env.baseUrl}comment` , Router.commentRouter);


app.get("/" , (req,res)=>res.send("hello"));
app.get("*" ,(req,res)=>res.send("invalid ApI")); 