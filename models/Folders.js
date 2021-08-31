const mongoose = require("mongoose");
const napid = require("napid");

const foldersSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: napid,
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
