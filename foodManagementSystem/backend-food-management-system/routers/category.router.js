"use strict";
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const {
  authenticateToken
} = require("../middleware/authentication.middleware");
const { checkRole } = require("../middleware/check-role.middleware");

router.post(
  "/add",
  authenticateToken,
  checkRole,
  categoryController.createCategory
);
router.get("/get", authenticateToken, categoryController.getAllCategory);
router.patch(
  "/update",
  authenticateToken,
  checkRole,
  categoryController.updateCategory
);

module.exports = router;
