const serviceLocator = require("../lib/service_locator");
const joi = serviceLocator.get("joi");

module.exports = joi
  .object()
  .keys({
    username: joi
      .string()
      .alphanum()
      .trim()
      .lowercase()
      .min(4)
      .max(15)
      .required(),
    password: joi.string().trim().required(),
  })
  .required();
