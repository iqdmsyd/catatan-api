const serviceLocator = require("../lib/service_locator");

let httpStatus = serviceLocator.get("httpStatus");
let errors = serviceLocator.get("errs");

module.exports.paramValidation = (log, joi) => {
  return (req, res, next) => {
    // Always allow validation to allow unknown fields by default
    let options = {
      allowUnknown: true,
      convert: false,
    };

    // Validation object (joi object) in route
    let validation = req.route.spec.validation;
    if (!validation) {
      return next(); // Skip validation if joi not set
    }

    // Properties to be validated
    let validProperties = ["body", "query", "params"];

    // For every joi object
    for (let i in validation) {
      if (validProperties.indexOf(i) < 0) {
        log.error("Route contains unsupported validation key");
        throw new Error("An unsupported validation key was set in route");
      } else {
        if (req[i] === undefined) {
          log.error(`Empty request ${i} was sent`);

          res.send(
            httpStatus.BAD_REQUEST,
            new errors.InvalidArgumentError(`Missing request ${i}`)
          );
          return;
        }

        try {
          let result = joi.attempt(req[i], validation[i], options);
        } catch (err) {
          log.error(`Validation error - ${err.details[0].message}`);
          res.send(
            httpStatus.BAD_REQUEST,
            new errors.InvalidArgumentError(
              `Invalid request ${i} - ${err.details[0].message}`
            )
          );
          return;
        }

        log.info("Successfully validated request parameters");
      }
    }
    next();
  };
};
