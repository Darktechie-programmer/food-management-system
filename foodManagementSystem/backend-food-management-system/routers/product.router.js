"use strict";
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const {
  authenticateToken
} = require("../middleware/authentication.middleware");
const { checkRole } = require("../middleware/check-role.middleware");

router.post(
  "/add",
  authenticateToken,
  checkRole,
  productController.createProduct
);
router.get(
  "/get",
  authenticateToken,
  checkRole,
  productController.getAllProduct
);
router.get(
  "/get-by-category/:id",
  authenticateToken,
  productController.getByCategory
);

router.get("/get-by-id/:id", authenticateToken, productController.getByProductId);

router.patch(
  "/update",
  authenticateToken,
  checkRole,
  productController.updateProduct
);

router.delete(
  "/delete/:id",
  authenticateToken,
  checkRole,
  productController.deleteProduct
);

router.patch(
  "/update-status",
  authenticateToken,
  checkRole,
  productController.updateStatus
);

module.exports = router;
