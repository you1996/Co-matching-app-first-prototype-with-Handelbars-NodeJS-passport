const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  linkedinId: {
    type: String,
    required: true,
  },
  givenName: {
    type: String,
    required: true,
  },
  familyName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  profilpic: {
    type: String,
  },
  info: Object,
  matchingList: Array,
});

module.exports = mongoose.model("User", UserSchema);
