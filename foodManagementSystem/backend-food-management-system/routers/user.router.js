/* eslint-disable comma-dangle */
"use strict";
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  authenticateToken,
} = require("../middleware/authentication.middleware");
const { checkRole } = require("../middleware/check-role.middleware");

router.post("/signup", userController.signUpUser);
router.post("/login", userController.loginUser);
router.post("/forgot-password", userController.forgotUserPassword);
router.get("/get", authenticateToken, checkRole, userController.getUser);
router.patch("/update", authenticateToken, checkRole, userController.updateRoleUser);
router.get("/check-token", authenticateToken, userController.checkToken);
router.post(
  "/change-password",
  authenticateToken,
  userController.changePassword
);

module.exports = router;
