const errors = require("restify-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("./auth");
const config = require("../config/config");

module.exports = (server) => {
  // Get users
  server.get("/api/users", async (req, res, next) => {
    try {
      const users = await User.find();
      console.log("getting users..");
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
    // If username already exist
    if (user) next(new errors.InvalidContentError("Username already exist."));

    user = new User({
      username,
      password,
    });

    // Generate salt
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        // Hash password
        user.password = hash;
        // Save user
        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });

  // Authenticate user
  server.post("/api/auth", async (req, res, next) => {
    const { username, password } = req.body;

    try {
      // Auth user using imported function authenticate()
      const user = await auth.authenticate(username, password);

      // Create JWT
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET);
      res.send(token);
      next();
    } catch (err) {
      // User unauthorized
      return next(new errors.UnauthorizedError());
    }
  });
};
