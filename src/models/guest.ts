const mongoose = require("mongoose");
const GuestSchema = new mongoose.Schema({
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
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    require: true,
  },
}, { timestamps: true });

GuestSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email });
};

export default mongoose.model("user", GuestSchema);