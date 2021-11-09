const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  photoURL: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("auth", AuthSchema);
