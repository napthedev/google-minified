const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const foldersSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: nanoid,
  },
  name: {
    type: String,
    required: true,
  },
  path: {
    type: Array,
  },
  parentId: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("folders", foldersSchema);
