require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req?.headers?.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      return res.sendStatus(401);
    }

    const authResult = await jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    if (authResult) {
      res.locals = authResult;
    } else {
      return res.sendStatus(403);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
  next();
};

module.exports = { authenticateToken };
