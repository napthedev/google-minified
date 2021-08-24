const mongoose = require("mongoose");
const napid = require("napid");

const FormsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    required: true,
    default: napid,
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

module.exports = mongoose.model("Forms", FormsSchema);
