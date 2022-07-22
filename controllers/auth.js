const User = require("../models/users");
const { validationResult } = require("express-validator/check");
const jwt = require("jsonwebtoken");


exports.signUpUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.success = false;
    error.message =
      errors.array().length === 1 ? errors.array()[0].msg : errors.array();
    error.result = [];

    next(error);
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  if (
    !email &&
    !name &&
    !password &&
    email !== "" &&
    name !== "" &&
    password !== ""
  ) {
    const error = new Error("Missing Input fields");
    error.statusCode = 422;
    error.success = false;
    error.message = "Missing input fields";
    error.result = [];
    next(error);
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const user = new User({ name: name, email: email, password: password });
        user
          .save()
          .then((user) => {
            res.status(201).json({
              success: true,
              message: "User created successfully!",
              result: user,
            });
          })
          .catch((error) => {
            error.statusCode = 500;
            error.success = false;
            error.message = "Unable to create user";
            error.result = [];
            next(error);
          });
      } else {
        const error = new Error("Email already exists");
        error.statusCode = 422;
        error.success = false;
        error.message = "Email already exists";
        error.result = [];
        next(error);
      }
    })
    .catch((error) => {
      error.statusCode = 422;
      error.success = false;
      error.message = "Email already exists";
      error.result = [];
      next(error);
    });
};

exports.signInUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.success = false;
    error.message =
      errors.array().length === 1 ? errors.array()[0].msg : errors.array();
    error.result = [];

    next(error);
  }

  const email = req.body.email;
  const password = req.body.password;

  if (!email && !password && email !== "" && password !== "") {
    const error = new Error("Missing Input fields");
    error.statusCode = 422;
    error.success = false;
    error.message = "Missing input fields";
    error.result = [];
    next(error);
  }

  User.findOne({ email: email, password: password })
    .then((user) => {
      if (user) {
        console.log(user);
        const token = jwt.sign(
          { userId: user._id.toString(), email: email },
          "MySecretKey",
          { expiresIn: "1h" }
        );

        res.status(200).json({
          success: true,
          message: "User Logged In",
          result: user,
          token: token,
        });
      } else {
        const error = new Error("Invalid email or password");
        error.statusCode = 422;
        error.success = false;
        error.message = "Invalid email or password";
        error.result = [];
        next(error);
      }
    })
    .catch((error) => {
      error.statusCode = 422;
      error.success = false;
      error.message = "Cannot find user";
      error.result = [];
      next(error);
    });
};
