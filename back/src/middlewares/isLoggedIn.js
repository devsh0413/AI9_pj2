const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UnauthorizedError } = require("../lib/custom-error");

async function isLoggedIn(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.currentUserId = decoded.user_id;

    next();
  } catch (err) {
    const error = new UnauthorizedError(err);
    next(error);
  }
}

module.exports = isLoggedIn;
