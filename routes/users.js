const errors = require("restify-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const auth = require("./auth");
const config = require("../configs/config");

module.exports = (server) => {
  // Get users [development only]
  server.get("/api/users", async (req, res, next) => {
    try {
      const users = await User.find();
      res.send(users);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError());
    }
  });

  // Register user
  server.post("/api/register", async (req, res, next) => {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (user) next(new errors.InvalidContentError("Username already exist."));

    user = new User({
      username,
      password,
    });

    const hash = await auth.generateSalt(user.password);
    user.password = hash;

    try {
      const newUser = await user.save();
      res.send(201);
      next();
    } catch (err) {
      return next(new errors.InternalServerError());
    }
  });

  // Authenticate user
  server.post("/api/auth", async (req, res, next) => {
    const { username, password } = req.body;

    try {
      const user = await auth.authenticate(username, password);
      const userInfo = {
        _id: user._id,
        username: user.username,
      };

      jwt.sign(JSON.stringify(userInfo), config.JWT_SECRET, (err, token) => {
        res.send(token);
        next();
      });
    } catch (err) {
      return next(new errors.UnauthorizedError("Authentication failed."));
    }
  });
};
