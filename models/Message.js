const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true,
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
