"use strict";

const express = require("express");
const router = express.Router();
const billController = require("../controllers/bill.controller");
const {
  authenticateToken
} = require("../middleware/authentication.middleware");

router.post(
  "/generateReport",
  authenticateToken,
  billController.generateReport
);

router.post("/getPdf", authenticateToken, billController.getPDF);

router.get("/getBills", authenticateToken, billController.getAllBills);
router.delete("/delete/:id", authenticateToken, billController.deleteBill);
module.exports = router;
