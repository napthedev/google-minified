const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const DocumentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: nanoid,
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
