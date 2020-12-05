const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
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

const Note = mongoose.model("Note", NoteSchema);
module.exports = Note;
