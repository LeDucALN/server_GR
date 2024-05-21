/** @format */

import { Request, Response } from "express";
import GuestSchema from "../models/guest";


const UserController = {
	async getInfo(req: Request, res: Response) {
		const { id } = req.params;
		const guest = await GuestSchema.findById(id);
		const { password, ...info } = guest.toObject();
		res.status(200).json(info);
	},

	async updateInfo(req: Request, res: Response) {
		const { id } = req.params;
		const guest = await GuestSchema.findByIdAndUpdate
		(id, req.body, { new: true });
		const { password, ...info } = guest.toObject();
		res.status(200).json(info);
	}
};

export default UserController;