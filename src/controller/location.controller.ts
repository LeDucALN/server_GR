/** @format */

import { Request, Response } from "express";
import UserSchema from "../models/user";
import LocationSchema from "../models/location";
import user from "../models/user";

interface RequestWithUser extends Request {
	user: any;
}

const LocationController = {
	async getNoteLocations(req: RequestWithUser, res: Response) {
		const id = req.user.id;
		try {
			const location = await LocationSchema.findOne({ userId: id });
			res.status(200).json(location);
		} catch (err: any) {
			res.status(400).json({ message: err.message });
		}
	},

	async updateNoteLocation(req: RequestWithUser, res: Response) {
		const id = req.user.id;
		try {
			const form = req.body;
			let location = await LocationSchema.findOne({ userId: id });
			location.house = form.house;
			location.company = form.company;
			const newLocation = await LocationSchema.findByIdAndUpdate(
				location._id,
				location,
				{ new: true }
			);
			res.status(200).json(newLocation);
		} catch (err: any) {
			res.status(400).json({ message: err.message });
		}
	},
};

export default LocationController;
