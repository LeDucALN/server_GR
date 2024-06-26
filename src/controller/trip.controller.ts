/** @format */

import { Request, Response } from "express";
import UserSchema from "../models/user";
import TripSchema from "../models/trip";

interface RequestWithUser extends Request {
	user: any;
}


const TripController = {
	async getStatusTripUser(req: RequestWithUser, res: Response) {
		const id = req.user.id;
        const trip = await TripSchema.findOne({ userId: id, status: "pending" });
        if (!trip) {
            return res.status(200).json({ message: "No trip is pending" });
        }
        else {
            return res.status(200).json(trip);
        }
	},
};

export default TripController;
