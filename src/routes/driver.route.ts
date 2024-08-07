import { Router } from "express";
import DriverController from "../controller/driver.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.get("/getInfoMe", middlewareToken.verifyToken as any, middlewareToken.verifyDriver as any,  DriverController.getInfoMe as any);
route.put("/updateInfo", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any,  DriverController.updateInfo);
route.get("/getAllDriverByAdmin", middlewareToken.verifyToken as any, middlewareToken.verifyAdmin as any,  DriverController.getAllDriverByAdmin);
route.put("/updateStatusDriver", middlewareToken.verifyToken as any, middlewareToken.verifyAdmin as any,  DriverController.updateStatusDriver);

export default route;
