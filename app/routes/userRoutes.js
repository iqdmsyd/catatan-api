module.exports.register = (server, serviceLocator) => {
  server.post(
    {
      path: "/api/users",
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
      path: "/api/users/auth",
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
      path: "/api/users/:username",
      name: "Get User",
      version: "1.0.0",
    },
    (req, res, next) => serviceLocator.get("userController").get(req, res, next)
  );

  server.get(
    {
      path: "/api/users",
      name: "Get All User",
      version: "1.0.0",
    },
    (req, res, next) =>
      serviceLocator.get("userController").getAll(req, res, next)
  );
};
