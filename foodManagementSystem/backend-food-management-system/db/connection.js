"use strict";
const pg = require("pg");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 10, // max number of client in the pool
  idleTimeoutMillie: 30000
};

const pool = new pg.Pool(config);

module.exports = pool;
