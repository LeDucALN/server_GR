import { Response, Request } from "express";
import UserSchema from "../models/user";
import DriverSchema from "../models/driver";
const jwt = require('jsonwebtoken');

interface RequestWithUser extends Request {
    user: any;
}

const middlewareToken = {
    verifyToken: (req: RequestWithUser, res: Response, next: any) => {
        const token = req.headers.authorization
        if(token){
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
                if(err){
                    return res.status(403).json("Token is not valid!");
                }
                req.user = user;
                next();
            });
        }
        else{
            return res.status(401).json("You are not authenticated!");
        }
    },

    verifyUser: (req: RequestWithUser, res: Response, next: any) => {
        if(req.user.role === "user"){
            next();
        }
        else{
            return res.status(403).json("You are not authorized!");
        }
    },

    verifyDriver: (req: RequestWithUser, res: Response, next: any) => {
        if(req.user.role === "driver"){
            next();
        }
        else{
            return res.status(403).json("You are not authorized!");
        }
    }

}

export default middlewareToken;