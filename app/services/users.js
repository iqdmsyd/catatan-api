class UserService {
  constructor(log, mongoose, httpStatus, errs) {
    this.log = log;
    this.mongoose = mongoose;
    this.httpStatus = httpStatus;
    this.errs = errs;
  }

  async createUser(body) {
    const Users = this.mongoose.model("Users");
    const { username } = body;
    const user = await Users.findOne({ username });

    if (user) {
      const err = new this.errs.InvalidArgumentError(
        `User with username - ${username} already exists`
      );
      this.log.error(err.message);
      return err;
    }

    let newUser = new Users(body);
    newUser = await newUser.save();

    this.log.info("User created successfully");
    return newUser;
  }

  async getUser(username) {
    const Users = this.mongoose.model("Users");
    const user = await Users.findOne({ username });

    if (!user) {
      const err = new this.errs.NotFoundError(
        `User with username - ${username} does not exists`
      );
      this.log.error(err.message);
      return err;
    }

    this.log.info("User fetched successfully");
    return user;
  }

  async getAllUser() {
    const Users = this.mongoose.model("Users");
    const users = await Users.find();

    if (!users) {
      const err = new this.errs.NotFoundError(`Can not find any user`);
      this.log.error(err.message);
      return err;
    }

    this.log.info("All user fetched successfully");
    return users;
  }
}

module.exports = UserService;
