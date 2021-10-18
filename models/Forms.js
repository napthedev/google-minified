const mongoose = require("mongoose");
const { generate } = require("shortid");

const FormsSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: generate,
  },
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  content: {
    type: String,
  },
});

module.exports = mongoose.model("forms", FormsSchema);
