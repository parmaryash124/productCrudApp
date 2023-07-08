const con = require("../database");
const CustomErrorHandler = require("../middlewares/CustomErrorHandler");
const productSchema = require("../validator/productSchema");
const constant = require("../constant/index");
const productController = {
  
  async addProduct(req, res, next) {
    const { error } = productSchema.validate(req.body);
    if (error) return next(error);
    try {
  
      con.query(`insert into tbl_product set ?`, req.body, (err, response) => {
        if (err) return next(err);

        res.json({
          code: 1,
          message: "Product has been added successfully",
          data:[]
        });
      });
    } catch (error) {
      return next(error);
    }
  },

  async editProduct(req, res, next) {
    if (!req.params.productId) {
      return next(CustomErrorHandler.fieldRequired("product is required"));
    }
    const data = {
      ...(req.body.productName && { productName: req.body.productName }),
      ...(req.body.categoryId && { categoryId: req.body.categoryId }),
      ...(req.body.price && { price: req.body.price }),
      ...(req.body.description && { description: req.body.description }),
      ...(req.body.qty && { qty: req.body.qty })
    };
    con.query(
      `update tbl_product set ?  where id=${req.params.productId}`,
      data,
      (err, response) => {
        if (err) return next(err);
        if (response.affectedRows > 0) {
          res.json({
            code: 1,
            message: "Product has been updated successfully",
          });
        } else {
          res.json(constant.dataNotFound);
        }
      }
    );
  },

  async deleteProduct(req, res, next) {
    if (!req.body.productId)
      return next(CustomErrorHandler.fieldRequired("Product Id is required."));
    con.query(
      `update tbl_product set ? where id=${req.body.productId}`,
      { is_active: 0 },
      (err, response) => {
        if (err) return next(err);
        res.json({ code: 1, message: "Product has been deleted successfully" });
      }
    );
  },

  async fetchProducts(req, res, next) {
    let paginationQuery = "";
    let sort="p.id"
    let order="desc"
    
    if(req.body.sort){
      sort=req.body.sort
    }
    if(req.body.order){
      order= req.body.order
    }
    if (req.body.limit && req.body.page) {
      let page_token = Number(req.body.page);
      let pageLimit =
        page_token * Number(req.body.limit) - Number(req.body.limit);
      paginationQuery = `limit ${req.body.limit} offset ${pageLimit}`;
    }

    let search = ``;
    if (req.body.search && req.body.search != "") {
      search = `and productName like "${`%${req.body.search}%`}" || description like "${`%${req.body.search}%`}"`;
    }
    con.query(
      `SELECT p.*,
        c.categoryName
            from tbl_product p 
            inner join tbl_category c on p.categoryId = c.id 
            where p.is_active=1 ${search} order by ${sort} ${order} ${paginationQuery}`,
      (err, response) => {
        if (err) return next(err);
        if (response.length == 0) return res.json(constant.dataNotFound);
        con.query(
          `SELECT count(id) as totalRecords from tbl_product  where is_active=1  ${search}`,
          (countError, countResponse) => {
            if (countError) return next(err);
            res.json({
              code: 1,
              message: "fetch products",
              data: response ? response : [],
              totalRecords: countResponse[0].totalRecords || 0,
            });
          }
        );
      }
    );
  },

  async productbyId(req, res, next) {
    if (!req.params.id) {
      return next(CustomErrorHandler.fieldRequired("product id is required.."));
    }
    con.query(
      `select p.*,
      c.categoryName
            from tbl_product p  
            inner join tbl_category c on p.categoryId = c.id  
            where p.is_active=1 and p.id=${req.params.id}`,
      (err, response) => {
        if (err) return next(err);
        res.json({
          code: 1,
          message: "fetch products",
          data: response[0] ? response[0] : {},
        });
      }
    );
  },
};

module.exports = productController;
