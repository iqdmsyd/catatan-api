const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");

exports.authenticate = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get user by username
      const user = await User.findOne({ username });

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
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
