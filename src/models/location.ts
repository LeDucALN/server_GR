/** @format */
const mongoose = require("mongoose");
const LocationSchema = new mongoose.Schema(
	{
		userId: {
            type: String,
        },
        house: {
            type: Object,
            required: true
        },
        company: {
            type: Object,
            required: true
        }
	},
	{ timestamps: true }
);

export default mongoose.model("location", LocationSchema);
