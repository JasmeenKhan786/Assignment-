const jwt = require("jsonwebtoken");
const User = require("../models/users");
const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Token cannot be empty");
    error.statusCode = 422;
    error.success = false;
    error.message = "Token cannot be empty";
    error.result = [];
    next(error);
  }
  const token = authHeader.split(" ")[1]; 
  if (token) {
    const decodedToken = jwt.verify(
      token,
      "MySecretKey",
      function (err, decodedToken) {
        if (err) {
          const error = new Error("Invalid Token");
          error.statusCode = 422;
          error.success = false;
          error.message = err.message;
          error.result = [];
          next(error);
        }

        if (decodedToken) {
          req.uid = decodedToken.userId;
          req.email = decodedToken.email;
          User.findById(req.uid)
            .then((user) => {
              user.isAuth = true;
              return user.save();
            })
            .then((result) => {
              next();
            })
            .catch((err) => {
              const error = new Error("User not found");
              error.statusCode = 422;
              error.success = false;
              error.message = "User not found";
              error.result = [];
              next(error);
            });
        } else {
          const error = new Error("Invalid Token");
          error.statusCode = 422;
          error.success = false;
          error.message = "Invalid Token";
          error.result = [];
          next(error);
        }
      }
    );
  }
};

module.exports = isAuth;
