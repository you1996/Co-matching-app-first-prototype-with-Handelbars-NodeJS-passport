const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  linkedinId: {
    type: String,
    required: true,
  },
  matchingList: [{ _id: false, id: String, score: Number }],
  informations: { type: Object },
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
});

module.exports = mongoose.model("User", UserSchema);
