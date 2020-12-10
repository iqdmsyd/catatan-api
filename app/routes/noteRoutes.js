const config = require("../configs/config");
const authAdmin = require("../middlewares/authAdmin");

module.exports.register = (server, serviceLocator) => {
  server.get(
    {
      path: "/api/notes",
      name: "Get All Notes (User Scoped)",
      version: "1.0.0",
    },
    serviceLocator.get("rjwt")({ secret: config.app.SECRET_KEY }),
    (req, res, next) => serviceLocator.get("noteController").get(req, res, next)
  );

  server.get(
    {
      path: "/api/notes/:username",
      name: "Get User's Note (ADMIN only)",
      version: "1.0.0",
    },
    serviceLocator.get("rjwt")({ secret: config.app.SECRET_KEY }),
    authAdmin,
    (req, res, next) =>
      serviceLocator.get("noteController").getFromUser(req, res, next)
  );

  server.post(
    {
      path: "/api/notes",
      name: "Create A Note",
      version: "1.0.0",
      validation: {
        body: require("../validations/create_note"),
      },
    },
    serviceLocator.get("rjwt")({ secret: config.app.SECRET_KEY }),
    (req, res, next) =>
      serviceLocator.get("noteController").create(req, res, next)
  );

  server.put(
    {
      path: "/api/notes/:id",
      name: "Update User's Note",
      version: "1.0.0",
      validation: {
        body: require("../validations/create_note"),
      },
    },
    serviceLocator.get("rjwt")({ secret: config.app.SECRET_KEY }),
    (req, res, next) =>
      serviceLocator.get("noteController").update(req, res, next)
  );

  server.del(
    {
      path: "/api/notes/:id",
      name: "Delete User Note",
      version: "1.0.0",
    },
    serviceLocator.get("rjwt")({ secret: config.app.SECRET_KEY }),
    (req, res, next) =>
      serviceLocator.get("noteController").delete(req, res, next)
  );
};
