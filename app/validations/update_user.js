const serviceLocator = require("../lib/service_locator");
const joi = serviceLocator.get("joi");

module.exports = joi
  .object()
  .keys({
    role: joi.string().required(),
  })
  .required();
