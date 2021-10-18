const mongoose = require("mongoose");
const { generate } = require("shortid");

const SubmitsSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: generate,
  },
  id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("submits", SubmitsSchema);
