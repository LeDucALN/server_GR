import { Router } from "express";
import GuestController from "../controller/guest.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.get("/:id", middlewareToken.verifyToken as any, middlewareToken.verifyGuest as any,  GuestController.getInfo);
route.put("/:id", middlewareToken.verifyToken as any, middlewareToken.verifyGuest as any,  GuestController.updateInfo);

export default route;
