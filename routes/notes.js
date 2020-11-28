const errors = require("restify-errors");
const User = require("../models/User");
const Note = require("../models/Note");

module.exports = (server) => {
  // Get notes for a user
  server.get("/api/:username", async (req, res, next) => {
    const username = req.params.username;
    const notes = await Note.find({ username });
    res.send(notes);
    next();
  });

  // Post a note
  server.post("/api/:username", async (req, res, next) => {
    const username = req.params.username;
    const { title, content } = req.body;

    try {
      const note = new Note({
        username,
        title,
        content,
      });

      const newNote = await note.save();
      res.send(201);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });

  // Update a note
  server.put("/api/:username", async (req, res, next) => {
    const note_id = req.body._id;
    console.log(req.body);

    try {
      const note = await Note.findOneAndUpdate(
        {
          _id: note_id,
        },
        req.body
      );
      res.send(200);
      next();
    } catch (err) {
      return next(new errors.ResourceNotFoundError(err.message));
    }
  });

  // Delete a note
  server.del("/api/:username", async (req, res, next) => {
    const note_id = req.body._id;
    try {
      const note = await Note.findOneAndDelete(
        {
          _id: note_id,
        },
        req.body
      );
      res.send(204);
      next();
    } catch (err) {
      return next(new errors.ResourceNotFoundError(err.message));
    }
  });
};
