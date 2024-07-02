import { Express } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import driverRouter from "./driver.route";
import tripRouter from "./trip.route";
import locationRouter from "./location.route";
function route(app: Express) {
	app.use("/api/auth", authRouter);
	app.use("/api/user", userRouter);
	app.use("/api/driver", driverRouter);
	app.use("/api/trip", tripRouter);
	app.use("/api/location", locationRouter);
}

module.exports = route;