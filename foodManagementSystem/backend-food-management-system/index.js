"use strict";
const express = require("express");
const cors = require("cors");
const app = express();
const userRoute = require("./routers/user.router");
const categoryRoute = require("./routers/category.router");
const productRoute = require("./routers/product.router");
const billRoute = require("./routers/bill.router");
const dashboardRoute = require("./routers/dashboard.router");

// middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// user Route
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/product", productRoute);
app.use("/bill", billRoute);
app.use("/dashboard", dashboardRoute);

app.get("/", (req, res) => {
  res.send("<h1>Hi, Amit you are the best.</h1>");
});

module.exports = app;
