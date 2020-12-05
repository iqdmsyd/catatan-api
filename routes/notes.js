const errors = require("restify-errors");
const jwt = require("jsonwebtoken");
const rjwt = require("restify-jwt-community");
const Note = require("../models/Note");
const config = require("../config/config");

module.exports = (server) => {
  // Get all notes [development only]
  server.get("/api/notes", async (req, res, next) => {
    const notes = await Note.find();
    res.send(notes);
    next();
  });

  // Get notes of a user
  server.get(
    "/api/users/me/notes",
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      const username = req.user.username;
      const notes = await Note.find({ username });
      res.send(notes);
      next();
    }
  );

  // Post a note
  server.post(
    "/api/notes",
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      const username = req.user.username;
      const { title, content } = req.body;

      try {
        const note = new Note({
          username,
          title,
          content,
        });

        const newNote = await note.save();
        res.send(201, newNote); // success, item created, send back the item
        next();
      } catch (err) {
        return next(new errors.InternalError(err.message));
      }
    }
  );

  // Update a note
  server.put(
    "/api/notes/:id",
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      const username = req.user.username;
      const note_id = req.params.id;

      try {
        const note = await Note.findOneAndUpdate(
          { _id: note_id, username },
          req.body
        );

        if (note === null) throw err;
        res.send(200, note); // success, send back the updated item
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no note with id of ${req.params.id}`
          )
        );
      }
    }
  );

  // Delete a note
  server.del(
    "/api/notes/:id",
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      const username = req.user.username;
      const note_id = req.params.id;

      try {
        const note = await Note.findOneAndRemove({
          _id: note_id,
          username,
        });

        if (note === null) throw err;
        res.send(204); // success, but no need to change the content
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no note with id of ${req.params.id}`
          )
        );
      }
    }
  );
};
