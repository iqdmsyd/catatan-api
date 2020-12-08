class NoteService {
  constructor(log, mongoose, httpStatus, errs) {
    this.log = log;
    this.mongoose = mongoose;
    this.httpStatus = httpStatus;
    this.errs = errs;
  }

  async createNote(username, body) {
    const Users = this.mongoose.model("Users");
    const user = await Users.findOne({ username });
    const { title, content } = body;

    if (!user) {
      const err = new this.errs.NotFoundError(
        `User with username - ${username} does not exists`
      );
      this.log.error(err.message);
      return err;
    }

    user.notes.push({
      title,
      content,
    });

    this.log.info("Note created successfully");
    return user.save();
  }

  async getNote(username) {
    const Users = this.mongoose.model("Users");
    const user = await Users.findOne({ username });

    if (!user) {
      const err = new this.errs.NotFoundError(
        `User with username - ${username} does not exists`
      );
      this.log.error(err.message);
      return err;
    }

    this.log.info("Note fetched successfully");
    return user.notes;
  }

  async updateNote(username, note_id, body) {
    const { title, content } = body;
    const Users = this.mongoose.model("Users");
    const result = await Users.updateOne(
      { username },
      {
        $set: {
          "notes.$[elem].title": title,
          "notes.$[elem].content": content,
        },
      },
      {
        arrayFilters: [{ "elem._id": note_id }],
      },
      (e) => {
        // TODO: THROW THIS ERR INSTEAD OF ERROR FROM MONGOOSE
        const err = new this.errs.NotFoundError(
          `Note with username - ${username} and note_id - ${note_id} does not exists`
        );
        this.log.error(err.message);
        return err;
      }
    );

    this.log.info("Note updated successfully");
    const user = await Users.findOne(
      { username, "notes._id": note_id },
      { _id: 0, "notes.$": 1 }
    );
    return user;
  }
}

module.exports = NoteService;
