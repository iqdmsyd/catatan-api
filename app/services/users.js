const config = require("../configs/config");

class UserService {
  constructor(log, mongoose, httpStatus, errs, bcrypt, jwt) {
    this.log = log;
    this.mongoose = mongoose;
    this.httpStatus = httpStatus;
    this.errs = errs;
    this.bcrypt = bcrypt;
    this.jwt = jwt;
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

    const newUser = new Users({ username, password, role: "USER" });
    newUser.password = await this.hashPassword(password);
    let result = await newUser.save();

    this.log.info("User created successfully");
    return result;
  }

  async hashPassword(password) {
    const salt = await this.bcrypt.genSaltSync(10);
    const hash = await this.bcrypt.hashSync(password, salt);
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
      // Create JWT
      const token = this.jwt.sign(user.toJSON(), config.app.SECRET_KEY, {
        expiresIn: "1d",
      });

      const { iat, exp } = this.jwt.decode(token);
      const result = {
        token,
        iat,
        exp,
      };

      this.log.info("User authentication success");
      return result;
    } else {
      const err = new this.errs.UnauthorizedError(`Authentication failed`);
      this.log.error(err.message);
      return err;
    }
  }

  async getAllUser() {
    const Users = this.mongoose.model("Users");
    const users = await Users.find();

    if (!users) {
      const err = new this.errs.NotFoundError(`Can not find any user`);
      // this.log.error(err.message);
      return err;
    }

    // this.log.info("All user fetched successfully");
    return users;
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

  async updateUser(username, body) {
    const { role } = body;
    const Users = this.mongoose.model("Users");
    let user;

    await Users.findOneAndUpdate(
      { username },
      { role },
      { new: true },
      (e, doc) => {
        if (e) return e;
        user = doc;
      }
    );

    if (!user) {
      const err = new this.errs.NotFoundError(
        `User with username - ${username} does not exists`
      );
      return err;
    }

    this.log.info("User's role updated successfully");
    return user;
  }

  async deleteUser(username) {
    const Users = this.mongoose.model("Users");
    let user;

    await Users.findOneAndDelete({ username }, (e, doc) => {
      if (e) return e;
      user = doc;
    });

    if (!user) {
      const err = new this.errs.NotFoundError(
        `User with username - ${username} does not exists`
      );
      this.log.error(err.message);
      return err;
    }

    this.log.info("User deleted successfully");
    return user;
  }
}

module.exports = UserService;
