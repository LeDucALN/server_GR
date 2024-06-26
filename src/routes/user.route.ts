import { Router } from "express";
import UserController from "../controller/user.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.get("/getInfoMe", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any,  UserController.getInfoMe as any);
route.put("/updateInfo", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any,  UserController.updateInfo as any);
route.get("/getPaymentMethodDefault", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any,  UserController.getPaymentMethodDefault as any);
route.put("/updatePaymentMethodDefault", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any,  UserController.updatePaymentMethodDefault as any);

export default route;
