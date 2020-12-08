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

    return user.notes;
  }
}

module.exports = NoteService;
