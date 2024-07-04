import { Router } from "express";
import TripController from "../controller/trip.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.get("/getStatusTripUser", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any,  TripController.getStatusTripByUser as any);
route.get("/getStatusTripDriver", middlewareToken.verifyToken as any, middlewareToken.verifyDriver as any,  TripController.getStatusTripByDriver as any);
route.get("/getAllTripByUser", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any,  TripController.getAllTripByUser as any);
route.get("/getAllTripByDriver", middlewareToken.verifyToken as any, middlewareToken.verifyDriver as any,  TripController.getAllTripByDriver as any);
route.post("/createCommentForTrip", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any,  TripController.createCommentForTrip as any);

export default route;
