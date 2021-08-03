const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const FormsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  formId: {
    type: String,
    required: true,
    default: nanoid,
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
