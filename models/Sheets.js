const mongoose = require("mongoose");
const napid = require("napid");

const SheetSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: napid,
  },
  name: {
    type: String,
    default: "Untitled Sheet",
  },
  data: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("sheets", SheetSchema);
