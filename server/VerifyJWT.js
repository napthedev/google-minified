const jwt = require("jsonwebtoken");
require("dotenv/config");

function verifyJWT(req, res, next) {
  const authToken = req.cookies.token;
  if (req.body.email && req.body.password) {
    req.user = {
      email: req.body.email,
      password: req.body.password,
    };
    return next();
  }
  if (!authToken)
    return res.status(400).send({
      code: "no-access-token",
      message: "Access token is not provided",
    });

  jwt.verify(authToken, process.env.JWT_SECRET_TOKEN, (err, user) => {
    if (err) {
      return res.status(400).send({
        code: "invalid-access-token",
        message: "The access token is invalid",
      });
    } else {
      req.user = user;
      next();
    }
  });
}

function verifyJWTNotStrict(req, res, next) {
  const authToken = req.cookies.token;

  jwt.verify(authToken, process.env.JWT_SECRET_TOKEN, (err, user) => {
    req.user = user;
    next();
  });
}

module.exports = { verifyJWT, verifyJWTNotStrict };
