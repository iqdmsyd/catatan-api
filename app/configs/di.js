const serviceLocator = require("../lib/service_locator");
const config = require("./config");

serviceLocator.register("logger", () => {
  return require("../lib/logger").create(config.log);
});

serviceLocator.register("httpStatus", () => {
  return require("http-status");
});

serviceLocator.register("mongoose", () => {
  return require("mongoose");
});

serviceLocator.register("errs", () => {
  return require("restify-errors");
});

serviceLocator.register("joi", () => {
  return require("joi");
});

serviceLocator.register("userService", (serviceLocator) => {
  const log = serviceLocator.get("logger");
  const mongoose = serviceLocator.get("mongoose");
  const httpStatus = serviceLocator.get("httpStatus");
  const errs = serviceLocator.get("errs");

  const UserService = require("../services/users");
  return new UserService(log, mongoose, httpStatus, errs);
});

serviceLocator.register("userController", (serviceLocator) => {
  const UserService = serviceLocator.get("userService");

  const UserController = require("../controllers/users");
  return new UserController(UserService);
});

serviceLocator.register("noteService", (serviceLocator) => {
  const log = serviceLocator.get("logger");
  const mongoose = serviceLocator.get("mongoose");
  const httpStatus = serviceLocator.get("httpStatus");
  const errs = serviceLocator.get("errs");

  const NoteService = require("../services/notes");
  return new NoteService(log, mongoose, httpStatus, errs);
});

serviceLocator.register("noteController", (serviceLocator) => {
  const NoteService = serviceLocator.get("noteService");

  const NoteController = require("../controllers/notes");
  return new NoteController(NoteService);
});

module.exports = serviceLocator;
