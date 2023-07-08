const con = require("../database");
const CustomErrorHandler = require("../middlewares/CustomErrorHandler");
const constant = require("../constant/index");
const categoryController = {
  async addCategory(req, res, next) {
    if (!req.body.categoryName)
      return next(
        CustomErrorHandler.fieldRequired("category Name field is required...")
      );
    try {
      await con.query(`select categoryName from tbl_category where categoryName='${req.body.categoryName}'`,async(err,response)=>{
        if(err) return next(err)
        if(response.length > 0){
          return next(CustomErrorHandler.alreadyExist("This category Name has been already added."))
        }
       else{
        await con.query(
          `insert into tbl_category set ?`,
          { categoryName: req.body.categoryName },
          (err, response) => {
            if (err) return next(err);
            res.json({
              code: 1,
              message: "Category has been added successfully",
            });
          }
        );
       }
      })
     
    } catch (err) {
      return next(err);
    }
  },

  async editCategory(req, res, next) {
    if (!req.body.categoryId || !req.body.categoryName) {
      return next(
        CustomErrorHandler.fieldRequired("category Id field is required...")
      );
    }
    try {
      con.query(
        `update tbl_category set ? where id=${req.body.categoryId}`,
        { categoryName: req.body.categoryName },
        (err, response) => {
          if (err) return next(err);
          if (response.affectedRows == 0)
            return res.json({ code: 0, message: "Category Id not found" });
          res.json({ code: 1, message: "Category has been edit successfully" });
        }
      );
    } catch (err) {
      return next(err);
    }
  },

  async deleteCategory(req, res, next) {
    if (!req.body.categoryId) {
      return next(
        CustomErrorHandler.fieldRequired("category Id field is required...")
      );
    }
    try {
      con.query(
        `update tbl_category set ? where id=${req.body.categoryId}`,
        { is_active: 0 },
        (err, response) => {
          if (err) return next(err);
          res.json({
            code: 1,
            message: "Category has been deleted successfully",
          });
        }
      );
    } catch (err) {
      return next(err);
    }
  },

  async getCategories(req, res, next) {
    try {
      let paginationQuery = "";
      if (req.body.limit && req.body.page) {
        let page_token = Number(req.body.page);
        let pageLimit =
          page_token * Number(req.body.limit) - Number(req.body.limit);
        paginationQuery = `limit ${req.body.limit} offset ${pageLimit}`;
      }
      let search = "";
      if (req.body.search && req.body.search != "")
        search = `and categoryName like "${`%${req.body.search}%`}"`;

      con.query(
        `SELECT * from tbl_category  where is_active=1 ${search} order by id ${paginationQuery}`,
        (err, response) => {
          if (err) return next(err);
          if (response.length == 0) return res.json(constant.dataNotFound);

          con.query(
            `SELECT count(id) as totalRecords from tbl_category  where is_active=1  ${search}`,
            (countError, countResponse) => {
              if (countError) return next(err);
              return res.json({
                code: 1,
                message: "Category has been fetched successfully",
                data: response,
                totalRecords: countResponse[0].totalRecords || 0,
              });
            }
          );
        }
      );
    } catch (error) {
      return next(error);
    }
  },

  async getCategoryById(req, res, next) {
    try {
      if (!req.params.categoryId) {
        return next(
          CustomErrorHandler.fieldRequired("category id is required")
        );
      }
      let ss = con.query(
        `SELECT * from tbl_category  where is_active=1 and id=${req.params.categoryId}`,
        (err, response) => {
          if (err) return next(err);
          if (response.length == 0) return res.json(constant.dataNotFound);
          return res.json({
            code: 1,
            message: "Sub Category has been fetched successfully",
            data: response[0],
          });
        }
      );
    } catch (e) {
      return next(e);
    }
  },
};

module.exports = categoryController;
