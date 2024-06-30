/** @format */

import { Request, Response } from "express";
import UserSchema from "../models/user";
import TripSchema from "../models/trip";
import DriverSchema from "../models/driver";
import ChatSchema from "../models/chat";
import { create } from "domain";

interface RequestWithUser extends Request {
	user: any;
}

const TripController = {
	async getStatusTripByUser(req: RequestWithUser, res: Response) {
		const id = req.user.id;
		try {
			const trip = await TripSchema.findOne({
				userId: id,
				status: "pending",
			});
			if (!trip) {
				return res
					.status(200)
					.json({ message: "Bạn đang không có chuyến đi nào" });
			} else {
				let driverId = trip.driverId;
				const chat = await ChatSchema.findOne({ tripId: trip._id });
				let driver = await DriverSchema.findById(driverId);
				return res.status(200).json({
					...trip.toJSON(),
					driver,
					chat: chat ? chat.messages : [],
				});
			}
		} catch (error) {
			return res.status(400).json(error);
		}
	},

	async getStatusTripByDriver(req: RequestWithUser, res: Response) {
		const id = req.user.id;
		try {
			const trip = await TripSchema.findOne({
				driverId: id,
				status: "pending",
			});
			if (!trip) {
				const driver = await DriverSchema.findById(id);
				return res
					.status(200)
					.json({
						message: "Bạn đang không có chuyến đi nào",
						currentLocation: driver.location,
					});
			} else {
				const guest = await UserSchema.findById(trip.userId);
				const chat = await ChatSchema.findOne({ tripId: trip._id });
				const TRIP_DETAIL = {
					_id: trip._id,
					PICKUP: {
						PU_NAME_DETAIL: trip.PULocation,
						PU_NAME_SORT: trip.pulocation,
						PU_LOCATE: trip.PU,
					},
					DESTINATION: {
						DS_NAME_DETAIL: trip.DSLocation,
						DS_NAME_SORT: trip.dslocation,
						DS_LOCATE: trip.DS,
					},
					
					PRICE: trip.price,
					STATUS: trip.status,
					createdAt: trip.createdAt,
					USER: guest.toJSON(),
				}
				return res
					.status(200)
					.json({chat: chat ? chat.messages : [], TRIP_DETAIL, driverPosition: trip.driverPosition, tripRoom: trip.tripRoom} );
			}
		} catch (error) {
			return res.status(400).json(error);
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
					driver,
				};
			})
		);
		return res.status(200).json(trips);
	},

	async createCommentForTrip(req: RequestWithUser, res: Response) {
		const { tripId, comment, rating } = req.body;
		try {
			const trip = await TripSchema.findById(tripId);
			trip.comment = comment;
			trip.rating = rating;
			await trip.save();
			return res.status(200).json({...trip.toJSON(), message: "Comment successfully"});
		}
		catch(err: any){
			return res.status(400).json({message: err.message})
		}
	},
};

export default TripController;
