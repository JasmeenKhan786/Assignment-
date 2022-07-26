const express = require("express");

const router = express.Router();

const validation = require("../functions/validationFunctions");

const authController = require("../controllers/auth");

router.post(
  "/signIn",
  validation.postSignInValidation,
  authController.signInUser
);

router.put(
  "/signUp",
  validation.putSignUpValidation,
  authController.signUpUser
);

module.exports = router;
