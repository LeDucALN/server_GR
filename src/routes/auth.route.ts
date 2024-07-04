import { Router } from "express";
import AuthController from "../controller/auth.controller";
const route = Router();

route.post("/user/signin", AuthController.userSignin);
route.post("/user/signup", AuthController.UserSignup);
route.post("/driver/signin", AuthController.driverSignin);
route.post("/driver/signup", AuthController.driverSignup);
route.post("/admin/signin", AuthController.adminSignin);
route.get("/admin/isLogin", AuthController.isLoginAdmin);

export default route;
