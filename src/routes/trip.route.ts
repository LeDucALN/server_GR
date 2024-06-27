import { Router } from "express";
import TripController from "../controller/trip.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.get("/getStatusTripUser", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any,  TripController.getStatusTripUser as any);
route.get("/getAllTripByUser", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any,  TripController.getAllTripByUser as any);

export default route;
