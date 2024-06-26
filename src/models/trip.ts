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
		}
	},
	{ timestamps: true }
);

export default mongoose.model("trip", TripSchema);
