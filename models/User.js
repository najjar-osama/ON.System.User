const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    default: "user"
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now()
  },
  active: {
    type: Boolean,
    default: true
  },
  emailVerfication: Schema.Types.Mixed
});

module.exports = User = mongoose.model("users", UserSchema);
