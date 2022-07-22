const express = require("express");
const { body } = require("express-validator/check");

const router = express.Router();

const authController = require("../controllers/auth");

router.post(
  "/signIn",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email!")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password should atleast have 6 characters!"),
  ],
  authController.signInUser
);
 
router.put(
  "/signUp",
  [
    body("name").trim().notEmpty().withMessage("Please enter a valid name!"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email!")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password should atleast have 6 characters!"),
  ],
  authController.signUpUser
);

module.exports = router;
