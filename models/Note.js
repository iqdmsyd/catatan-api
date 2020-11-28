const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const NoteSchema = new mongoose.Schema({
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
});

NoteSchema.plugin(timestamp);

const Note = mongoose.model("Note", NoteSchema);
module.exports = Note;
