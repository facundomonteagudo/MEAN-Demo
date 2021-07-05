import jwt from "jsonwebtoken";
import { RequestHandler } from "express";



export const checkAuth: RequestHandler = (req, res, next) =>{
    try{
        const token = req.headers.token;
        if(!token || typeof token !== 'string'){
            throw new Error("Invalid token.")
        }
            const tokenInfo = jwt.verify(token, process.env.JWT_KEY!) as {email: string, userId:string};
            req.userInfo = {email: tokenInfo.email, userId: tokenInfo.userId};
            next();
    }catch(err){
        res.status(401).json({message: "You are not authenticated. Please log in"});
    }
}