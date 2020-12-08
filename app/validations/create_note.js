const serviceLocator = require("../lib/service_locator");
const joi = serviceLocator.get("joi");

module.exports = joi
  .object()
  .keys({
    title: joi.string().required(),
    content: joi.string().required(),
  })
  .required();
