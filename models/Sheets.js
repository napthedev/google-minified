const mongoose = require("mongoose");
const { generate } = require("shortid");

const SheetSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: generate,
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
