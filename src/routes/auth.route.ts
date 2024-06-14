import { Router } from "express";
import AuthController from "../controller/auth.controller";
const route = Router();

route.post("/user/signin", AuthController.userSignin);
route.post("/user/signup", AuthController.guestSignup);
route.post("/driver/signin", AuthController.driverSignin);
route.post("/driver/signup", AuthController.driverSignup);

export default route;
