const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/auth");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", auth.authorized, authController.logout);

router.post(
  "/admin/addCategory",
  auth.authorized,
  auth.checkUserType,
  categoryController.addCategory
);
router.post(
  "/admin/editCategory",
  auth.authorized,
  auth.checkUserType,
  categoryController.editCategory
);
router.post(
  "/admin/deleteCategory",
  auth.authorized,
  auth.checkUserType,
  categoryController.deleteCategory
);
router.post(
  "/getCategories",
  auth.authorized,
  categoryController.getCategories
);
router.post(
  "/category/:categoryId",
  auth.authorized,
  categoryController.getCategoryById
);


// product releated routes..

router.post(
  "/product/addProduct",
  auth.authorized,
  auth.checkUserType,
  productController.addProduct
);

router.post(
  "/product/editProduct/:productId",
  auth.authorized,
  auth.checkUserType,
  productController.editProduct
);

router.post(
  "/product/deleteProduct",
  auth.authorized,
  auth.checkUserType,
  productController.deleteProduct
);

router.post(
  "/product/fetchProducts",
  auth.authorized,
  productController.fetchProducts
);

router.post("/product/:id", auth.authorized, productController.productbyId);

// order related routes.

router.post("/order/createOrder", auth.authorized, orderController.createOrder);
router.post("/order/myorders", auth.authorized, orderController.myOrders);


module.exports = router;
