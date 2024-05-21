/** @format */

import { Request, Response } from "express";
import DriverSchema from "../models/driver";


const DriverController = {
	async getInfo(req: Request, res: Response) {
		const { id } = req.params;
		const driver = await DriverSchema.findById(id);
		const { password, ...info } = driver.toObject();
		res.status(200).json(info);
	},

	async updateInfo(req: Request, res: Response) {
		const { id } = req.params;
		const driver = await DriverSchema.findByIdAndUpdate
		(id, req.body, { new: true });
		const { password, ...info } = driver.toObject();
		res.status(200).json(info);
	}
};

export default DriverController;
