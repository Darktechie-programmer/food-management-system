require("dotenv").config();

const checkRole = (req, res, next) => {
  try {
    if (res.locals.role === process.env.USER) {
      res.sendStatus(401);
    }
  } catch (err) {
    res.sendStatus(500);
  }
  next();
};

module.exports = { checkRole };
