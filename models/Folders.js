const mongoose = require("mongoose");
const { generate } = require("shortid");

const foldersSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: generate,
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
});

module.exports = mongoose.model("folders", foldersSchema);
