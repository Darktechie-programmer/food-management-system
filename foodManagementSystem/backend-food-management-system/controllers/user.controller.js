"use strict";
const pool = require("../db/connection");
const format = require("pg-format");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
require("dotenv").config();

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const signUpUser = async (req, res) => {
  try {
    const user = req.body;
    if (!user.email) {
      return res
        .status(400)
        .json({ message: "Please Provide Complete Details" });
    }
    let sqlQuery = format(
      `
      SELECT
        email,
        password,
        status,
        role
      FROM
        public.fms_user
      where
        email = '%s';
      `,
      user.email
    );
    let userResult = await pool.query(sqlQuery);
    if (userResult.rowCount <= 0) {
      sqlQuery = format(
        `
        INSERT INTO
        public.fms_user(
          name,
          "contactNumber",
          email,
          password,
          status,
          role
          )
        VALUES
          ('%s', '%s', '%s', '%s', '%s', '%s');`,
        user.name,
        user.contactNumber,
        user.email,
        user.password,
        "false",
        "user"
      );
      userResult = await pool.query(sqlQuery);
      return res.status(201).json({ message: "Successfully Registered" });
    } else {
      return res.status(400).json({ message: "Email Already Exist." });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const user = req.body;
    if (!user.email || !user.password) {
      return res
        .status(400)
        .json({ message: "Please Provide Email & Password" });
    }

    const sqlQuery = format(
      `
      SELECT
        email,
        password,
        status,
        role
      FROM
        public.fms_user
      where
        email = '%s';
      `,
      user.email
    );

    const userResult = await pool.query(sqlQuery);
    if (
      userResult.rowCount <= 0 ||
      userResult.rows[0].password !== user.password
    ) {
      return res
        .status(401)
        .json({ message: "Incorrect User Name or Password" });
    } else if (userResult.rows[0].status === "false") {
      return res.status(401).json({ message: "Wait for Admin Approval" });
    } else if (userResult.rows[0].password === user.password) {
      const response = {
        email: userResult.rows[0].email,
        role: userResult.rows[0].role
      };
      const accessToken = await jwt.sign(
        response,
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: process.env.JWT_LIFETIME }
      );
      return res.status(200).json({ token: accessToken });
    } else {
      return res
        .status(400)
        .json({ message: "Something went wrong, Please Try Again later!!" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const forgotUserPassword = async (req, res) => {
  try {
    const user = req.body;
    if (!user.email) {
      return res.status(400).json({ message: "Please Provide Email Address" });
    }

    const sqlQuery = format(
      `
      SELECT
        email,
        password,
        status,
        role
      FROM
        public.fms_user
      where
        email = '%s';
      `,
      user.email
    );

    const userResult = await pool.query(sqlQuery);

    if (userResult.rowCount <= 0) {
      return res
        .status(200)
        .json({ message: "Password sent successfully to your email account" });
    } else {
      const mailOption = {
        from: process.env.EMAIL,
        to: userResult.rows[0].email,
        subject: "Password by Food Management System",
        html: `
                <p>
                    <b>Your Login details for Food Management System</b>
                    <br>
                    <b>Email:</b> ${userResult.rows[0].email}
                    <br>
                    <b>Password:</b> ${userResult.rows[0].password}
                    <br>
                    <a href='http://localhost:4200'> Click Here to Login </a>
                </p>`
      };
      const mailResultInfo = await transporter.sendMail(mailOption);
      if (mailResultInfo) {
        console.log("Email Sent", mailResultInfo.response);
      }
      return res
        .status(200)
        .json({ message: "Password sent successfully to your email account" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getUser = async (req, res) => {
  try {
    const sqlQuery = format(
      `
      SELECT
        id,
        email,
        password,
        status,
        role
      FROM
        public.fms_user
      where
        role = 'user';
      `
    );
    const userResult = await pool.query(sqlQuery);
    if (userResult.rowCount) {
      return res
        .status(200)
        .json({ result: userResult.rows, count: userResult.rowCount });
    } else {
      return res.status(404).json({ message: "User doesn't exist !!" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateRoleUser = async (req, res) => {
  try {
    const user = req.body;
    if (!user.status || !user.id) {
      return res.status(400).json({ message: "Please Provide Id & Status" });
    }
    const sqlQuery = format(
      `
      UPDATE
        public.fms_user
      SET
        status = '%s'
      where
        id = '%s';

      `,
      user.status,
      user.id
    );
    const userResult = await pool.query(sqlQuery);
    if (userResult.rowCount <= 0) {
      return res.status(404).json({ message: "User id doesn't exist" });
    }
    return res.status(200).json({ message: "User Updated Successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const checkToken = async (req, res) => {
  try {
    return res.status(200).json({ message: "true" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const changePassword = async (req, res) => {
  try {
    const user = req.body;
    if (!user.oldPassword || !user.newPassword) {
      return res
        .status(400)
        .json({ message: "Please Provide oldPassword & newPassword" });
    }

    const email = res.locals.email;
    let sqlQuery = format(
      `
      SELECT
        id,
        email,
        password,
        status,
        role
      FROM
        public.fms_user
      where
        email = '%s'
        AND password = '%s';
      `,
      email,
      user.oldPassword
    );
    let userResult = await pool.query(sqlQuery);
    if (userResult.rowCount <= 0) {
      return res.status(400).json({ message: "Incorrect Old Password" });
    } else if (userResult.rows[0].password === user.oldPassword) {
      sqlQuery = format(
        `
        UPDATE
          public.fms_user
        SET
          password = '%s'
        where
          email = '%s';
        `,
        user.newPassword,
        email
      );
      userResult = await pool.query(sqlQuery);
      if (userResult.rowCount) {
        return res
          .status(200)
          .json({ message: "Password Updated Successfully" });
      } else {
        return res
          .status(404)
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

module.exports = {
  signUpUser,
  loginUser,
  forgotUserPassword,
  getUser,
  updateRoleUser,
  checkToken,
  changePassword
};
