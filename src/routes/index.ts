import { Express } from "express";
import authRouter from "./auth.route";
import guestRouter from "./guest.route";
import driverRouter from "./driver.route";
function route(app: Express) {
	app.use("/api/auth", authRouter);
	app.use("/api/guest", guestRouter);
	app.use("/api/driver", driverRouter);
}

module.exports = route;