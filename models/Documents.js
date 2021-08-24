const mongoose = require("mongoose");
const napid = require("napid");

const DocumentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: napid,
  },
  name: {
    type: String,
    default: "Untitled Document",
  },
  data: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("documents", DocumentSchema);
