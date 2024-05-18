import { Express } from "express";
import authRouter from "./auth.route";
function route(app: Express) {
	app.use("/auth", authRouter);
}

module.exports = route;