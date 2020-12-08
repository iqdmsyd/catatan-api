class NoteController {
  constructor(noteService) {
    this.noteService = noteService;
  }

  async create(req, res) {
    try {
      const { body } = req;
      const { username } = req.params;
      const result = await this.noteService.createNote(username, body);

      res.send(result);
    } catch (err) {
      res.send(err);
    }
  }

  async get(req, res) {
    try {
      const { username } = req.params;
      const result = await this.noteService.getNote(username);

      res.send(result);
    } catch (err) {
      res.send(err);
    }
  }

  async update(req, res) {
    try {
      const { username, note_id } = req.params;
      const { body } = req;
      const result = await this.noteService.updateNote(username, note_id, body);

      res.send(result);
    } catch (err) {
      res.send(err);
    }
  }

  async delete(req, res) {
    try {
      const { username, note_id } = req.params;
      const { body } = req;
      const result = await this.noteService.deleteNote(username, note_id, body);

      res.send(result);
    } catch (err) {
      res.send(err);
    }
  }
}

module.exports = NoteController;
