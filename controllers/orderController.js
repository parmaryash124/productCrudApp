const con = require("../database");
const CustomErrorHandler = require("../middlewares/CustomErrorHandler");
const orderSchema = require("../validator/orderSchema");
const orderController = {
  

  async updateProductQty (productId,orderQty,res,next){
    return new Promise((resolve,reject)=>{
        con.query(`update tbl_product set qty=qty -${orderQty} where id=${productId} `,(err,response)=>{
          if(err) return next(err)
          resolve()
        })
    })
  },
  async createOrder(req, res, next) {
    try {
      const { error } = orderSchema.validate(req.body);
      if (error) return next(error);

      await con.query(`select * from tbl_product where id=${req.body.productId}`,(err,response)=>{
        if(err) return next(err);
        if(response.length == 0) return next(CustomErrorHandler.notFound("No product Found"))
        else {
          let { price,qty} = response[0]
          const orderbody = {
            productId: req.body.productId,
            orderQty: req.body.orderQty,
            totalAmount: +price * +qty,
          };
          con.query(
            `insert into tbl_order set ?`,
            orderbody,
            async (err, response) => {
              console.log(err);
              if (err) return next(err);
              await orderController.updateProductQty(req.body.productId,req.body.orderQty,res,next);
              res.json({
                code: 1,
                message: "Order has been created successfully",
                data: [],
              });
            }
          );
        }
      })
     
    } catch (e) {
      return next(e);
    }
  },
};

module.exports = orderController;
