const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const createTransport = (config) => {
  const customTransport = [];

  if (config.file) {
    customTransport.push(
      new transports.File({
        filename: config.file,
        level: config.level,
      })
    );
  }

  if (config.console) {
    customTransport.push(
      new transports.Console({
        level: config.level,
      })
    );
  }

  return customTransport;
};

module.exports = {
  create: (config) => {
    return createLogger({
      transports: createTransport(config),
      format: combine(
        label({ label: "Catatan API" }),
        timestamp(),
        prettyPrint()
      ),
    });
  },
};
