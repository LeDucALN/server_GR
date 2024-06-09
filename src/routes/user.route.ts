import { Router } from "express";
import GuestController from "../controller/guest.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.get("/getInfoMe", middlewareToken.verifyToken as any, middlewareToken.verifyGuest as any,  GuestController.getInfoMe as any);
route.put("/updateInfo", middlewareToken.verifyToken as any, middlewareToken.verifyGuest as any,  GuestController.updateInfo as any);
route.get("/getPaymentMethodDefault", middlewareToken.verifyToken as any, middlewareToken.verifyGuest as any,  GuestController.getPaymentMethodDefault as any);
route.put("/updatePaymentMethodDefault", middlewareToken.verifyToken as any, middlewareToken.verifyGuest as any,  GuestController.updatePaymentMethodDefault as any);

export default route;
