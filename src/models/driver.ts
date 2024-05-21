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
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    require: true,
  },
});

DriverSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email });
};

export default mongoose.model("driver", DriverSchema);