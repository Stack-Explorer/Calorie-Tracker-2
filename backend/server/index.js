import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectDB } from "../lib/connection.js";
import connectionRouter from "../router/auth.router.js"
import cookieParser from "cookie-parser";
import logicRoutes from "../router/logic.router.js"
import cors from "cors";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

const PORT = process.env.PORT;

app.use("/",connectionRouter);
app.use("/",logicRoutes);

app.listen(PORT,()=>{
    connectDB();
    console.log("Server is working on : " + PORT);
});