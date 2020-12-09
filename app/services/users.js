class UserService {
  constructor(log, mongoose, httpStatus, errs, bcrypt) {
    this.log = log;
    this.mongoose = mongoose;
    this.httpStatus = httpStatus;
    this.errs = errs;
    this.bcrypt = bcrypt;
  }

  async hashPassword(password) {
    const salt = this.bcrypt.genSaltSync(10);
    const hash = this.bcrypt.hashSync(password, salt);
    return hash;
  }

  async authenticateUser(body) {
    const Users = this.mongoose.model("Users");
    const { username, password } = body;
    const user = await Users.findOne({ username });

    if (!user) {
      const err = new this.errs.UnauthorizedError(`Authentication failed`);
      this.log.error(err.message);
      return err;
    }

    const isMatch = this.bcrypt.compareSync(password, user.password);
    if (isMatch) {
      this.log.info("User authentication success");
      return user;
    } else {
      const err = new this.errs.UnauthorizedError(`Authentication failed`);
      this.log.error(err.message);
      return err;
    }
  }

  async createUser(body) {
    const Users = this.mongoose.model("Users");
    const { username, password } = body;
    const user = await Users.findOne({ username });

    if (user) {
      const err = new this.errs.InvalidArgumentError(
        `User with username - ${username} already exists`
      );
      this.log.error(err.message);
      return err;
    }

    const newUser = new Users({ username, password });
    newUser.password = await this.hashPassword(password);
    let result = await newUser.save();

    this.log.info("User created successfully");
    return result;
  }

  async getUser(username) {
    const Users = this.mongoose.model("Users");
    const user = await Users.findOne(
      { username },
      { _id: 0, username: 1, notes: 1 }
    );

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
    const users = await Users.find({}, { username: 1, notes: 1 });

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
