const Joi = require("joi");
const productSchema = Joi.object({
  productName: Joi.string().required().messages({
    "any.required": `Product Name is a required field`,
  }),
  categoryId: Joi.number().required().messages({
    "any.required": `CategoryId is a required field`,
  }),
  price: Joi.number().required().messages({
    "any.required": `Price is a required field`,
  }),
  description: Joi.string().required().messages({
    "any.required": `Description is a required field`,
  }),
  qty: Joi.number().required().messages({
    "any.required": `Qty is a required field`,
  })
}).unknown(true);

module.exports = productSchema;
