/** @format */

import { Request, Response } from "express";
import UserSchema from "../models/user";
import TripSchema from "../models/trip";
import DriverSchema from "../models/driver";

interface RequestWithUser extends Request {
	user: any;
}

const TripController = {
	async getStatusTripUser(req: RequestWithUser, res: Response) {
		const id = req.user.id;
		try {
			const trip = await TripSchema.findOne({
				userId: id,
				status: "pending",
			});
			if (!trip) {
				return res.status(200).json({ message: "Bạn đang không có chuyến đi nào" });
			} else {
				return res.status(200).json(trip);
			}
		}
		catch (error) {
			return res.status(400).json(error)
		}
		
	},

	async getAllTripByUser(req: RequestWithUser, res: Response) {
		const id = req.user.id;
		let trips = await TripSchema.find({ userId: id });
		if (!trips) {
			return res
				.status(200)
				.json({ message: "You don't have any trips yet" });
		}

		trips = await Promise.all(
			trips.map(async (trip: any) => {
				const driver = await DriverSchema.findById(trip.driverId);
				const {
					username,
					license,
					brand,
					typeofVehicle,
					vehice,
                    seat,
					...rest
				} = driver.toObject();
				return {
					...trip.toObject(),
					driver: { username, license, brand, typeofVehicle, vehice, seat },
				};
			})
		);
		return res.status(200).json(trips);
	},
};

export default TripController;
