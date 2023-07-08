const Joi = require("joi");
const orderSchema = Joi.object({
  productId: Joi.required().messages({
    "any.required": `productId is a required field`,
  }),
  orderQty: Joi.required().messages({
    "any.required": `orderQty is a required field`,
  })
}).unknown(true);

module.exports = orderSchema;
