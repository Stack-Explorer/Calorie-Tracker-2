import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectDB } from "../lib/connection.js";
import connectionRouter from "../router/auth.router.js"
import cookieParser from "cookie-parser";
import logicRoutes from "../router/logic.router.js"
import cors from "cors";
import path from "path"

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
const __dirname = path.resolve();

app.use("/",connectionRouter);
app.use("/",logicRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../../frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../../frontend","dist","index.html"))
    })
}

app.listen(PORT,()=>{
    connectDB();
    console.log("Server is working on : " + PORT);
});