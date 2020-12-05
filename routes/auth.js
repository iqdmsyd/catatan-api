const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = mongoose.model("User");

exports.authenticate = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get user by username
      const user = await User.findOne({ username });
      // console.log(user);

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) reject(err);
        if (isMatch) {
          resolve(user);
        } else {
          // Password didn't match
          reject("Authentication failed.");
        }
      });
    } catch (err) {
      // Username not found
      reject("Authentication failed.");
    }
  });
};

exports.generateSalt = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Generate salt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          // Hash password
          resolve(hash);
        });
      });
    } catch (err) {
      reject(err);
    }
  });
};
