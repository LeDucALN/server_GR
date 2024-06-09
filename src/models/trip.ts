/** @format */

const mongoose = require("mongoose");
const TripSchema = new mongoose.Schema(
	{
		nameDriver: {
			type: String,
		},
		nameGuest: {
			type: String,
		},
		pickupLocation: {
			type: String,
		},
		destinationLocation: {
			type: String,
		},
		status: {
			type: Boolean,
		},
        driverId: {
            type: String,
        },
        guestId: {
            type: String,
        },
        price: {
            type: Number,
        },
        distance: {
            type: Number,
        },
        duration: {
            type: Number,
        },
	},
	{ timestamps: true }
);

export default mongoose.model("trip", TripSchema);
