/* eslint-disable comma-dangle */
"use strict";
const format = require("pg-format");
const pool = require("../db/connection");

const createCategory = async (req, res) => {
  try {
    const category = req.body;
    if (!category.name) {
      return res
        .status(400)
        .json({ message: "Please Provide the Name of the Category" });
    }
    const sqlQuery = format(
      `INSERT INTO
          public.fms_category(name)
       VALUES
          ('%s');`,
      category.name
    );
    const categoryResult = await pool.query(sqlQuery);
    if (categoryResult.rowCount) {
      return res.status(200).json({ message: "Category Added Successfully!!" });
    } else {
      return res
        .status(404)
        .json({ message: "Something went wrong, Please Try Again later!!" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getAllCategory = async (req, res) => {
  try {
    const sqlQuery = format(`
    SELECT
        id,
        name
    FROM
        public.fms_category;
    `);
    const categoryResult = await pool.query(sqlQuery);
    if (categoryResult.rowCount) {
      return res
        .status(200)
        .json({ results: categoryResult.rows, count: categoryResult.rowCount });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = req.body;
    if (!category.name || !category.id) {
      return res
        .status(400)
        .json({ message: "Please Provide the Name of the Category" });
    }
    const sqlQuery = format(
      `
      UPDATE
        public.fms_category
      SET
        name = '%s'
      WHERE
        id = '%s';
      `,
      category.name,
      category.id
    );
    const categoryResult = await pool.query(sqlQuery);
    if (categoryResult.rowCount > 0) {
      return res.status(200).json({ message: "Category Updated Successfully" });
    } else {
      return res.status(404).json({ message: "Category id does not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  createCategory,
  getAllCategory,
  updateCategory,
};
