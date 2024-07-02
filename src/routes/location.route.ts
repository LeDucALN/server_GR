import { Router } from "express";
import LocationController from "../controller/location.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.get("/getNoteLocations", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any,  LocationController.getNoteLocations as any);
route.post("/updateNoteLocation", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any,  LocationController.updateNoteLocation as any);


export default route;