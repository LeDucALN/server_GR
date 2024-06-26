const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
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
  phoneNumber: {
    type: String,
    require: true,
  },
  paymentMethod: {
    type: String,
    require: true,
    default: "Tiền mặt",
  },
  isTrip: {
    type: Boolean,
    default: false,
  },
  trips: {
    type: [String],
  },
}, { timestamps: true });

UserSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email });
};

export default mongoose.model("user", UserSchema);