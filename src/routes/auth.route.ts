import { Router } from "express";
import AuthController from "../controller/auth.controller";
const route = Router();

route.post("/login", AuthController.login);
route.post("/signup", AuthController.signup);

export default route;
