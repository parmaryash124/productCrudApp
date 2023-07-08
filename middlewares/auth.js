const con = require("../database");
const CustomErrorHandler = require("./CustomErrorHandler");

const auth = {
  async authorized(req, res, next) {
    try {
      const token = req.headers.token.split(" ")[1];
      con.query(
        `select * from tbl_user where token='${token}'`,
        (err, response) => {
          if (err) return next(err);
          if (response.length == 0)
            return next(CustomErrorHandler.unAuthorized("unAuthorized"));
          const { password, ...user } = response[0];
          req.user = user;
          next();
        }
      );
    } catch (e) {
      return next(e);
    }
  },

  async checkUserType(req, res, next) {
    if (req.user.userType === "admin") {
      next();
      return;
    }
    return next(CustomErrorHandler.unAuthorized());
  },
};

module.exports = auth;
