const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
    },
    notes: [NoteSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);
