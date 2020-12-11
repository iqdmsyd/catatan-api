const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(process.env.NODE_ENV + ".env"),
});

module.exports = {
  app: {
    NAME: process.env.APP_NAME,
    HOST: process.env.APP_HOST || process.env.HOST,
    PORT: process.env.APP_PORT || process.env.PORT,
    ENV: process.env.NODE_ENV,
    SECRET_KEY: process.env.APP_SECRET_KEY,
  },
  mongodb: {
    URI: process.env.MONGODB_URI,
  },
  log: {
    file: process.env.LOG_PATH,
    level: process.env.LOG_LEVEL,
    console: process.env.LOG_ENABLE_CONSOLE,
  },
};
