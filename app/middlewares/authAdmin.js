const serviceLocator = require("../lib/service_locator");
const httpStatusCodes = serviceLocator.get("httpStatus");

module.exports = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    res.send(
      httpStatusCodes.FORBIDDEN,
      new Error(
        "The request was valid, but the server is refusing action",
        "FORBIDDEN"
      )
    );
    return next(false);
  } else {
    next();
  }
};
