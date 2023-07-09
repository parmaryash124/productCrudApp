const con = require("../database");
const common = require("../common/index");
const CustomErrorHandler = require("../middlewares/CustomErrorHandler");
const userSchema = require("../validator/userSchema");
const bcrypt = require('bcrypt')

const authController = {

  async signup(req, res, next) {
    try {
      const { error } = userSchema.validate(req.body);
      if (error) return next(error);
      await common.checkEmail(req.body.email, res, next);
      const token = await common.tokenGenerate(next);
      const securePassowrd = await bcrypt.hash(req.body.password, 10,);

      const signupRequest = {
        email: req.body.email,
        password: securePassowrd,
        token: token,
      };
      await con.query(
        `insert into tbl_user set ?`,
        signupRequest,
        (err, response) => {
          if (err) return next(err);
          res.json({ code: 1, message: "Sign Up successfully done.", data: { email:signupRequest.email, token } });
        }
      );
    } catch (e) {
      return next(e);
    }
  },

  async login(req, res, next) {
    if (!req.body.email || !req.body.password) {
      return next(
        CustomErrorHandler.wrongCredentials(
          "Email and Password must be provided.."
        )
      );
    }
    try {
      await con.query(
        `select * from tbl_user where email='${req.body.email}'`,
        async (err, response) => {
          if (err) return next(err);
          if (response.length == 0)
            return next({ code: 0, message: "Invalid credentials" });
          const  decryptPasword =  await  bcrypt.compare(req.body.password, response[0].password);
          if(!decryptPasword){
            return next(CustomErrorHandler.unAuthorized("Invalid credentials"));
          }
          const token = await common.tokenGenerate(next);
          await common.tokenUpdate(req.body, res, next, token);
          const { password, ...finalResponse } = response[0];
          finalResponse.token = token;
          res.json({
            code: 1,
            message: "Login successfully",
            data: finalResponse,
          });
        }
      );
    } catch (error) {
      return next(error);
    }
  },

  async logout(req, res, next) {
    con.query(
      `update tbl_user set token=""  where id=${req.user.id}`,
      (err, response) => {
        if (err) return next(err);
        res.json({ code: 1, message: "Logout suceessfully." });
      }
    );
  }

};

module.exports = authController;
