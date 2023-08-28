"use strict";
const express = require("express");
const router = express.Router();
const {
  authenticateToken
} = require("../middleware/authentication.middleware");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/details", authenticateToken, dashboardController.getDetails);

module.exports = router;
