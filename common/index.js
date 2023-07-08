const con = require("../database");
const randomstring = require("randomstring");
const CustomErrorHandler = require("../middlewares/CustomErrorHandler");

const common = {
 
  async checkEmail(email, res, next) {
    return new Promise((resolve, reject) => {
      con.query(
        `select * from tbl_user where email='${email}'`,
        (err, response) => {
          if (err) return next(err);
          if (response.length > 0)
            return next(
              CustomErrorHandler.alreadyExist("email already registered")
            );
          return resolve(response);
        }
      );
    });
  },

  async tokenGenerate(next) {
    return new Promise((resolve, reject) => {
      // if (reject) return next(reject)
      if (resolve) {
        resolve(
          randomstring.generate({
            length: 30,
            charset: "alphabetic",
          })
        );
      }
    });
  },

  async tokenUpdate(req, res, next, token) {
    return new Promise((resolve, reject) => {
      con.query(
        `update tbl_user set token=? where email='${req.email}'`,
        token,
        (err, response) => {
          if (err) return next(err);
          return resolve();
        }
      );
    });
  },
};

module.exports = common;
