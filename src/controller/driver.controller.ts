/** @format */

import { Request, Response } from "express";
import DriverSchema from "../models/driver";

interface RequestWithUser extends Request {
	user: any;
}

const DriverController = {
	async getInfoMe(req: RequestWithUser, res: Response) {
		const id = req.user.id;
		const user = await DriverSchema.findById(id);
		const { password, ...info } = user.toObject();
		res.status(200).json(info);
	},

	async updateInfo(req: Request, res: Response) {
		const { id } = req.params;
		const driver = await DriverSchema.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		const { password, ...info } = driver.toObject();
		res.status(200).json(info);
	},

	async getAllDriverByAdmin(req: Request, res: Response) {
		const drivers = await DriverSchema.find().sort({ isActive: 1 });
		res.status(200).json(drivers);
	},

	async updateStatusDriver(req: Request, res: Response) {
		const { id, status } = req.body;
		try {
			const driver = await DriverSchema.findByIdAndUpdate(
				id,
				{ status: status },
				{ new: true }
			);
			res.status(200).json({ message: "Update status success" });
		} catch (err: any) {
			res.status(400).json({ message: err.message });
		}
	},
};

export default DriverController;
