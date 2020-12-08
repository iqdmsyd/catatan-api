const serviceLocator = require("../configs/di");

module.exports.register = (server, serviceLocator) => {
  server.post(
    {
      path: "/api/notes/:username",
      name: "Create A Note",
      version: "1.0.0",
      validation: {
        body: require("../validations/create_note"),
      },
    },
    (req, res, next) =>
      serviceLocator.get("noteController").create(req, res, next)
  );

  server.get(
    {
      path: "/api/notes/:username",
      name: "Get User Note",
      version: "1.0.0",
    },
    (req, res, next) => serviceLocator.get("noteController").get(req, res, next)
  );

  server.put(
    {
      path: "/api/notes/:username/:note_id",
      name: "Update User Note",
      version: "1.0.0",
      validation: {
        body: require("../validations/create_note"),
      },
    },
    (req, res, next) =>
      serviceLocator.get("noteController").update(req, res, next)
  );

  server.del(
    {
      path: "/api/notes/:username/:note_id",
      name: "Delete User Note",
      version: "1.0.0",
    },
    (req, res, next) =>
      serviceLocator.get("noteController").delete(req, res, next)
  );
};
