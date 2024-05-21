import { Router } from "express";
import DriverController from "../controller/driver.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.get("/:id", middlewareToken.verifyToken as any, middlewareToken.verifyGuest as any,  DriverController.getInfo);
route.put("/:id", middlewareToken.verifyToken as any, middlewareToken.verifyGuest as any,  DriverController.updateInfo);

export default route;
