class CustomErrorHandler extends Error {
  constructor(status, msg, code = 0) {
    super();
    this.status = status;
    this.message = msg;
    this.code = code;
  }
  static alreadyExist(message) {
    return new CustomErrorHandler(400, message);
  }
  static invalid_api_Key(message) {
    return new CustomErrorHandler(401, message);
  }
  static wrongCredentials(message = "Wrong Credentials..") {
    return new CustomErrorHandler(400, message);
  }
  static unAuthorized(message = "unAuthorized") {
    return new CustomErrorHandler(401, message);
  }
  static notFound(message, code) {
    return new CustomErrorHandler(400, message, code);
  }
  static serverError(message = "Internal server error") {
    return new CustomErrorHandler(400, message);
  }
  static fieldRequired(message) {
    return new CustomErrorHandler(400, message);
  }
}

module.exports = CustomErrorHandler;
