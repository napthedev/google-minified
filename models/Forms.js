const mongoose = require("mongoose");
const napid = require("napid");

const FormsSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: napid,
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
