/* eslint-disable comma-dangle */
"use strict";
const format = require("pg-format");
const pool = require("../db/connection");

const getDetails = async (req, res) => {
  try {
    let categoryCount;
    let productCount;
    let billCount;

    let sqlQuery = format(`
        SELECT 
            COUNT(id) as category_count
        FROM 
            public.fms_category;
        `);
    let getDetailsResult = await pool.query(sqlQuery);
    if (getDetailsResult.rowCount) {
      categoryCount = getDetailsResult.rows[0].category_count;
    } else {
      return res.status(404).json({ message: "Category doesn't found!!" });
    }

    sqlQuery = format(`
        SELECT 
            COUNT(id) as product_count
        FROM 
            public.fms_product;
        `);
    getDetailsResult = await pool.query(sqlQuery);
    if (getDetailsResult.rowCount) {
      productCount = getDetailsResult.rows[0].product_count;
    } else {
      return res.status(404).json({ message: "Product doesn't found!!" });
    }

    sqlQuery = format(`
        SELECT 
            COUNT(id) as bill_count
        FROM 
            public.fms_bill;
        `);
    getDetailsResult = await pool.query(sqlQuery);
    if (getDetailsResult.rowCount) {
      billCount = getDetailsResult.rows[0].bill_count;
      const result = {
        category: categoryCount,
        product: productCount,
        bill: billCount,
      };
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Bill doesn't found!!" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getDetails,
};
