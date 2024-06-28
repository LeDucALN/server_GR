/** @format */
const mongoose = require("mongoose");
const TripSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
		},
		driverId: {
			type: String,
		},
		PU: {
			type: Object,
		},
        DS: {
            type: Object,
        },
		PULocation: {
			type: String,
		},
		DSLocation: {
			type: String,
		},
		pulocation: {
			type: String,
		},
		dslocation: {
			type: String,
		},
		driverPosition: {
			type: Object,
		},
        status: {
            type: String,
			default: "pending",
        },
        tripRoom: {
            type: String,
        },
        distance: {
            type: Number,
        },
		isArrived: {
			type: Boolean,
		},
		paymentMethod: {
			type: String,
		}
	},
	{ timestamps: true }
);

export default mongoose.model("trip", TripSchema);
