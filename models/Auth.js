const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");

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

AuthSchema.pre("save", function (next) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(this.password, salt);
    this.password = hashed;
    next();
  } catch (error) {
    console.log(error);
    next();
  }
});

module.exports = mongoose.model("Auth", AuthSchema);
