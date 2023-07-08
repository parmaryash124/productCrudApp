const Joi = require("joi");
const userSchema =Joi.object({
    email: Joi.string().email().required().messages({
      "any.required": `Email is a required field`,
    }),
    password: Joi.string().required().messages({
      "any.required": `password is a required field`,
    }),
  }).unknown(true);


module.exports = userSchema
