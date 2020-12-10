const config = require("../configs/config");
const authAdmin = require("../middlewares/authAdmin");

module.exports.register = (server, serviceLocator) => {
  server.post(
    {
      path: "/api/users/register",
      name: "Create User",
      version: "1.0.0",
      validation: {
        body: require("../validations/create_user"),
      },
    },
    (req, res, next) =>
      serviceLocator.get("userController").create(req, res, next)
  );

  server.post(
    {
      path: "/api/users/login",
      name: "Authenticate User",
      version: "1.0.0",
      validation: {
        body: require("../validations/create_user"),
      },
    },
    (req, res, next) =>
      serviceLocator.get("userController").auth(req, res, next)
  );

  server.get(
    {
      path: "/api/users",
      name: "Get All User",
      version: "1.0.0",
    },
    serviceLocator.get("rjwt")({ secret: config.app.SECRET_KEY }),
    authAdmin,
    (req, res, next) =>
      serviceLocator.get("userController").getAll(req, res, next)
  );

  server.get(
    {
      path: "/api/users/:username",
      name: "Get User",
      version: "1.0.0",
    },
    serviceLocator.get("rjwt")({ secret: config.app.SECRET_KEY }),
    authAdmin,
    (req, res, next) => serviceLocator.get("userController").get(req, res, next)
  );

  server.put(
    {
      path: "/api/users/:username",
      name: "Update User Role",
      version: "1.0.0",
      validation: {
        body: require("../validations/update_user"),
      },
    },
    serviceLocator.get("rjwt")({ secret: config.app.SECRET_KEY }),
    authAdmin,
    (req, res, next) =>
      serviceLocator.get("userController").update(req, res, next)
  );

  server.del(
    {
      path: "/api/users/:username",
      name: "Delete User",
      version: "1.0.0",
    },
    serviceLocator.get("rjwt")({ secret: config.app.SECRET_KEY }),
    authAdmin,
    (req, res, next) =>
      serviceLocator.get("userController").delete(req, res, next)
  );
};
