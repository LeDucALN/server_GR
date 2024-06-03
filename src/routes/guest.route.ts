import { Router } from "express";
import GuestController from "../controller/guest.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.get("/getInfoMe", middlewareToken.verifyToken as any, middlewareToken.verifyGuest as any,  GuestController.getInfoMe as any);
route.put("/:id", middlewareToken.verifyToken as any, middlewareToken.verifyGuest as any,  GuestController.updateInfo);

export default route;
