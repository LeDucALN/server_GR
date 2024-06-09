import { Express } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import driverRouter from "./driver.route";
function route(app: Express) {
	app.use("/api/auth", authRouter);
	app.use("/api/user", userRouter);
	app.use("/api/driver", driverRouter);
}

module.exports = route;