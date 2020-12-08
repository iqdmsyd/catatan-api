const serviceLocator = require("../lib/service_locator");
const logger = serviceLocator.get("logger");

class Database {
  constructor(uri) {
    this.mongoose = serviceLocator.get("mongoose");
    this._connect(uri);
  }

  _connect(uri) {
    this.mongoose.Promise = global.Promise;
    this.mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    const { connection } = this.mongoose;

    connection.on("connected", () => {
      logger.info("Database connection was successfull");
    });

    connection.on("error", (err) => {
      logger.info("Database connection failed." + err);
    });

    connection.on("disconnected", () => {
      logger.info("Database connection disconnected");
    });

    process.on("SIGINT", () => {
      connection.close();
      logger.info(
        "Database Connection closed due to NodeJS process termination"
      );
      process.exit(0);
    });

    require("../models/Users");
  }
}

module.exports = Database;
