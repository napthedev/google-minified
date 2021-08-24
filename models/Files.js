const mongoose = require("mongoose");

const filesSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  path: {
    type: Array,
  },
  parentId: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
});

module.exports = mongoose.model("files", filesSchema);
