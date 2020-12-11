const serviceLocator = require("./service_locator");

module.exports.register = (server) => {
  var httpStatusCodes = serviceLocator.get("httpStatus");

  server.on("NotFound", (req, res) => {
    res.send(
      httpStatusCodes.NOT_FOUND,
      new Error("Method not implemented", "METHOD_NOT_IMPLEMENTED")
    );
  });

  server.on("VersionNotAllowed", (req, res) => {
    res.send(
      httpStatusCodes.NOT_FOUND,
      new Error("Unsupported API version requested", "INVALID_VERSION")
    );
  });

  server.on("InvalidVersion", (req, res) => {
    res.send(
      httpStatusCodes.NOT_FOUND,
      new Error("Unsupported API version requested", "INVALID_VERSION")
    );
  });

  server.on("MethodNotAllowed", (req, res) => {
    res.send(
      httpStatusCodes.METHOD_NOT_ALLOWED,
      new Error("Method not implemented", "METHOD_NOT_ALLOWED")
    );
  });

  server.on("Unauthorized", (req, res) => {
    res.send(
      httpStatusCodes.UNAUTHORIZED,
      new Error("Authentication failed, try again", "UNAUTHORIZED")
    );
  });

  server.on("restifyError", (req, res, err) => {
    if (err.name === "InvalidCredentialsError") {
      res.send(httpStatusCodes.UNAUTHORIZED, new Error(err.body.message));
    }
  });
};
