const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const AuthSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  id: {
    type: String,
    required: true,
    default: nanoid,
  },
});

module.exports = mongoose.model("Auth", AuthSchema);
