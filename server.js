const restify = require("restify");
const versioning = require("restify-url-semver");
const config = require("./app/configs/config");
const fs = require("fs");

// Require DI
const serviceLocator = require("./app/configs/di");
const logger = serviceLocator.get("logger");
const joi = serviceLocator.get("joi");
const validator = require("./app/lib/validator");
const handler = require("./app/lib/error_handler");
const userRoutes = require("./app/routes/userRoutes");
const noteRoutes = require("./app/routes/noteRoutes");

// Create server
const server = restify.createServer({
  name: config.app.NAME,
  version: ["1.0.0"],
  formatters: {
    "application/json": require("./app/lib/jsend"),
  },
});

// Initialize the database
const Database = require("./app/configs/database");
new Database(config.mongodb.URI);

// Allow trailing slashes & API versioning
server.pre(restify.pre.sanitizePath());
// server.pre(versioning({ prefix: "/" }));

// Register middleware
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({ mapParams: false }));
server.use(validator.paramValidation(logger, joi));

// Register error handler
handler.register(server);

// Register routes
userRoutes.register(server, serviceLocator);
noteRoutes.register(server, serviceLocator);

// Home
server.get("/", (req, res, next) => {
  fs.readFile("./app/docs/index.html", "utf8", (err, file) => {
    try {
      res.writeHead(200, {
        "Content-Length": Buffer.byteLength(file),
        "Content-Type": "text/html",
      });
      res.write(file);
      res.end();
    } catch (err) {
      res.send(500, err);
      next();
    }
  });
});

// Start server
server.listen(config.app.PORT, config.app.HOST, () => {
  console.log(
    `${config.app.NAME} server running at http://${config.app.HOST}:${config.app.PORT}/`
  );
});
