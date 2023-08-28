/* eslint-disable comma-dangle */
"use strict";
const ejs = require("ejs");
const pdf = require("html-pdf");
const fs = require("fs");
const path = require("path");
const uuid4 = require("uuid4");
const format = require("pg-format");
const pool = require("../db/connection");

const generateReport = async (req, res) => {
  try {
    const generateUuid4 = uuid4();
    const orderDetails = req.body;
    const productDetailsReport = JSON.parse(orderDetails.productDetails);

    const sqlQuery = format(
      `
    INSERT INTO
        public.fms_bill(
        uuid,
        name,
        email,
        "contactNumber",
        "paymentMethod",
        total,
        "productDetails",
        "createdBy"
        )
    VALUES
        ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');
    `,
      generateUuid4,
      orderDetails.name,
      orderDetails.email,
      orderDetails.contactNumber,
      orderDetails.paymentMethod,
      orderDetails.totalAmount,
      orderDetails.productDetails,
      res.locals.email
    );

    const generateReportResult = await pool.query(sqlQuery);
    if (generateReportResult.rowCount) {
      const ejsResult = await ejs.renderFile(
        path.join(__dirname, "..", "public", "report.ejs"),
        {
          productDetails: productDetailsReport,
          name: orderDetails.name,
          email: orderDetails.email,
          contactNumber: orderDetails.contactNumber,
          paymentMethod: orderDetails.paymentMethod,
          totalAmount: orderDetails.totalAmount,
        },
        {
          async: true,
        }
      );

      if (ejsResult) {
        const options = {
          format: "A4",
          border: {
            top: "0.5in",
            right: "0.5in",
            bottom: "0.5in",
            left: "0.5in",
          },
        };
        const pdfResult = await new Promise((resolve, reject) => {
          pdf
            .create(ejsResult, options)
            .toFile(
              path.join(
                __dirname,
                "..",
                "uploads",
                "pdf",
                `${generateUuid4}.pdf`
              ),
              function (err, res) {
                if (err) {
                  reject(err);
                } else {
                  resolve(res);
                }
              }
            );
        });

        if (pdfResult) {
          return res.status(200).json({ uuid: generateUuid4 });
        } else {
          return res.status(400).json({
            message: "Something went wrong, Please Try Again later!!",
          });
        }
      } else {
        return res
          .status(400)
          .json({ message: "Something went wrong, Please Try Again later!!" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Something went wrong, Please Try Again later!!" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getPDF = async (req, res) => {
  try {
    const orderDetails = req.body;
    if (!orderDetails.uuid && orderDetails.email) {
      return res
        .status(400)
        .json({ message: "Please Provide the Order Details!!" });
    }
    const pdfPath = path.join(
      __dirname,
      "..",
      "uploads",
      "pdf",
      `${orderDetails.uuid}.pdf`
    );
    console.log("pdfPath", pdfPath);
    if (fs.existsSync(pdfPath)) {
      res.contentType("application/pdf");
      fs.createReadStream(pdfPath).pipe(res);
    } else {
      const productDetailsReport = JSON.parse(orderDetails.productDetails);
      const ejsResult = await ejs.renderFile(
        path.join(__dirname, "..", "public", "report.ejs"),
        {
          productDetails: productDetailsReport,
          name: orderDetails.name,
          email: orderDetails.email,
          contactNumber: orderDetails.contactNumber,
          paymentMethod: orderDetails.paymentMethod,
          totalAmount: orderDetails.totalAmount,
        },
        {
          async: true,
        }
      );

      if (ejsResult) {
        const options = {
          format: "A4",
          border: {
            top: "0.5in",
            right: "0.5in",
            bottom: "0.5in",
            left: "0.5in",
          },
        };
        const pdfResult = await new Promise((resolve, reject) => {
          pdf
            .create(ejsResult, options)
            .toFile(
              path.join(
                __dirname,
                "..",
                "uploads",
                "pdf",
                `${orderDetails.uuid}.pdf`
              ),
              function (err, res) {
                if (err) {
                  reject(err);
                } else {
                  resolve(res);
                }
              }
            );
        });

        if (pdfResult) {
          res.contentType("application/pdf");
          fs.createReadStream(pdfPath).pipe(res);
        } else {
          return res.status(400).json({
            message: "Something went wrong, Please Try Again later!!",
          });
        }
      } else {
        return res
          .status(400)
          .json({ message: "Something went wrong, Please Try Again later!!" });
      }
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getAllBills = async (req, res) => {
  try {
    const sqlQuery = format(
      `
      SELECT 
        id, 
        uuid, 
        name, 
        email, 
        "contactNumber", 
        "paymentMethod", 
        total, 
        "productDetails", 
        "createdBy" 
      FROM 
        public.fms_bill 
      ORDER BY
        id DESC;
    `
    );
    const getBillResult = await pool.query(sqlQuery);
    if (getBillResult.rowCount) {
      return res
        .status(200)
        .json({ result: getBillResult.rows, count: getBillResult.rowCount });
    } else {
      return res.status(400).json({ message: "Can't able to find Bill Data" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteBill = async (req, res) => {
  try {
    const billId = req.params.id;
    const sqlQuery = format(
      `
      DELETE FROM 
        public.fms_bill 
      WHERE 
        id='%s';
    `,
      billId
    );
    const billResult = await pool.query(sqlQuery);
    if (billResult.rowCount) {
      return res
        .status(200)
        .json({ message: "Bill is deleted Successfully!!" });
    } else {
      return res.status(404).json({ message: "Bill Id doesn't found!!" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  generateReport,
  getPDF,
  getAllBills,
  deleteBill,
};
