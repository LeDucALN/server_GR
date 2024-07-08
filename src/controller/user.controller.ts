/** @format */

import { Request, Response } from "express";
import UserSchema from "../models/user";

interface RequestWithUser extends Request {
	user: any;
}


const UserController = {
	async getInfoMe(req: RequestWithUser, res: Response) {
		const id = req.user.id;
		const guest = await UserSchema.findById(id);
		const { password, ...info } = guest.toObject();
		res.status(200).json(info);
	},

	async updateInfo(req: RequestWithUser, res: Response) {
		const id = req.user.id;
		const user = await UserSchema.findByIdAndUpdate
			(id, req.body, { new: true });
		const { password, ...info } = user.toObject();
		res.status(200).json(info);
	},

	async getPaymentMethodDefault(req: RequestWithUser, res: Response) {
		try {
			const id = req.user.id;
			const user = await UserSchema.findById(id);
			res.status(200).json(user.paymentMethod);
		}catch(err: any){
			res.status(400).json({message: err.message})
		}
		
	},

	async updatePaymentMethodDefault(req: RequestWithUser, res: Response) {
		try {
			const id = req.user.id;
			const user = await UserSchema.findByIdAndUpdate(id, { paymentMethod: req.body.paymentMethod }, { new: true });
			res.status(200).json(user.paymentMethod);
		}
		catch(err: any){
			res.status(400).json({message: err.message})
		}
	},
};

export default UserController;
