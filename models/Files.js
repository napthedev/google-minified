const mongoose = require("mongoose");

const filesSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  path: {
    type: Array,
  },
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("files", filesSchema);
