const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const filesSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: nanoid,
  },
  name: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
});

module.exports = mongoose.model("files", filesSchema);
