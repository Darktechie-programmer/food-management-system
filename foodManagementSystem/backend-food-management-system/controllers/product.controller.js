/* eslint-disable comma-dangle */
"use strict";
const format = require("pg-format");
const pool = require("../db/connection");

const createProduct = async (req, res) => {
  try {
    const product = req.body;
    if (
      !product.name ||
      !product.categoryId ||
      !product.description ||
      !product.price
    ) {
      return res
        .status(400)
        .json({ message: "Please Provide the Product Details" });
    }
    const sqlQuery = format(
      `
      INSERT INTO
        public.fms_product(name, "categoryId", description, price, status)
      VALUES
        ('%s', '%s', %L, '%s', '%s')`,
      product.name,
      product.categoryId,
      product.description,
      product.price,
      "true"
    );
    const categoryResult = await pool.query(sqlQuery);
    if (categoryResult.rowCount) {
      return res.status(200).json({ message: "Product Added Successfully!!" });
    } else {
      return res
        .status(404)
        .json({ message: "Something went wrong, Please Try Again later!!" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getAllProduct = async (req, res) => {
  try {
    const sqlQuery = format(
      `SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.status,
            c.id as categoryID,
            c.name as categoryName
        FROM
            public.fms_product as p
            INNER JOIN public.fms_category as c ON p."categoryId" = c.id;`
    );
    const productResult = await pool.query(sqlQuery);
    if (productResult.rowCount) {
      return res
        .status(200)
        .json({ result: productResult.rows, count: productResult.rowCount });
    } else {
      return res
        .status(404)
        .json({ message: "Something went wrong, Please Try Again later!!" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getByCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const sqlQuery = format(
      `SELECT
            id,
            name
        FROM
            public.fms_product
        WHERE 
            "categoryId"='%s' AND status='%s'
              `,
      id,
      "true"
    );
    const productResult = await pool.query(sqlQuery);
    if (productResult.rowCount) {
      return res
        .status(200)
        .json({ result: productResult.rows, count: productResult.rowCount });
    } else {
      return res
        .status(404)
        .json({ message: "Something went wrong, Please Try Again later!!" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getByProductId = async (req, res) => {
  try {
    const id = req.params.id;
    const sqlQuery = format(
      `SELECT
            id,
            name,
            description,
            price
        FROM
            public.fms_product
        WHERE 
            id='%s'
        `,
      id
    );
    const productResult = await pool.query(sqlQuery);
    if (productResult.rowCount) {
      return res
        .status(200)
        .json({ result: productResult.rows, count: productResult.rowCount });
    } else {
      return res.status(404).json({ message: "Product doesn't found!!" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = req.body;
    if (
      !product.id ||
      !product.name ||
      !product.categoryId ||
      !product.description ||
      !product.price
    ) {
      return res
        .status(400)
        .json({ message: "Please Provide the Product Details" });
    }
    const sqlQuery = format(
      `
    UPDATE
      public.fms_product
    SET
      name = '%s',
      "categoryId" = '%s',
      description = %L,
      price = '%s'
    WHERE
    id = '%s';
    `,
      product.name,
      product.categoryId,
      product.description,
      product.price,
      product.id
    );
    const productResult = await pool.query(sqlQuery);
    if (productResult.rowCount) {
      return res.status(200).json({ message: "Product Updated Successfully" });
    } else {
      return res.status(404).json({ message: "Product id doesn't found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const sqlQuery = format(
      `
      DELETE FROM
        public.fms_product
      WHERE
        id='%s';
      `,
      productId
    );
    const productResult = await pool.query(sqlQuery);
    if (productResult.rowCount) {
      return res
        .status(200)
        .json({ message: "Product Deleted Successfully!!" });
    } else {
      return res.status(404).json({ message: "Product id doesn't found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateStatus = async (req, res) => {
  try {
    const product = req.body;
    if (!product.id || !product.status) {
      return res
        .status(400)
        .json({ message: "Please Provide the Product Id & status" });
    }
    const sqlQuery = format(
      `
        UPDATE
            public.fms_product
        SET
            status = '%s'
        WHERE
            id = '%s';
        `,
      product.status,
      product.id
    );
    const productResult = await pool.query(sqlQuery);
    if (productResult.rowCount) {
      return res
        .status(200)
        .json({ message: "Product Updated Successfully!!" });
    } else {
      return res.status(404).json({ message: "Product id doesn't found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getByCategory,
  getByProductId,
  updateProduct,
  deleteProduct,
  updateStatus,
};
