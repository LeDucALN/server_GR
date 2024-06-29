/** @format */
const mongoose = require("mongoose");
const ChatSchema = new mongoose.Schema(
	{
		tripId: {
            type: String,
        },
        messages: {
            type: [Object]
        }
	},
	{ timestamps: true }
);

export default mongoose.model("chat", ChatSchema);
