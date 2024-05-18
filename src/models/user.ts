const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
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

UserSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email });
};

module.exports = mongoose.model("user", UserSchema);