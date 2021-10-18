const mongoose = require("mongoose");
const { generate } = require("shortid");

const DocumentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: generate,
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
