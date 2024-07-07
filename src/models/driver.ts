/** @format */

const mongoose = require("mongoose");
const DriverSchema = new mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		required: true,
	},
	password: {
		type: String,
		minLength: 8,
		required: true,
	},
	image: {
		type: String,
	},
	username: {
		type: String,
		required: true,
	},
	isFindTrip: {
		type: Boolean,
		default: false,
	},
	location: {
		type: Object,
	},
	isTrip: {
		type: Boolean,
		default: false,
	},
	telephone: {
		type: String,
	},
	vehicle: {
		type: String,
	},
	typeOfVehicle: {
		type: String,
	},
	seat: {
		type: Number,
	},
	license: {
		type: String,
	},
	brand: {
		type: String,
	},
	address: {
		type: String,
		default: "Hà Nội",
	},
	ratingAvg: {
		type: Number,
	},
	status: {
		type: String,
		default: "pending",
	},
	gender: {
		type: String,
	}
});

DriverSchema.statics.findByEmail = async function (email: string) {
	return this.findOne({ email });
};

export default mongoose.model("driver", DriverSchema);
