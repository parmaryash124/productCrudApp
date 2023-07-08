const { ValidationError } = require("joi");
const CustomErrorHandler = require("./CustomErrorHandler");

const errorHandler = async (err, req, res, next) => {
  let statusCode = 400;
  let code = 0;
  let data = {
    code,
    message: err.message,
    // ...(DEBUG_MODE === 'true' && { originalError: err.message })
  };

  if (err instanceof ValidationError) {
    statusCode = 400;
    data = {
      code,
      message: err.message,
      // ...(DEBUG_MODE === 'true' && { originalError: err.message })
    };
  }

  if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    data = {
      code: err.code != undefined ? err.code : code,
      message: err.message,
      // ...(DEBUG_MODE === 'true' && { originalError: err.message })
    };
  }

  //     const final_response = await common.encrypt(data)
  return res.status(statusCode).json(data);
};

module.exports = errorHandler;
