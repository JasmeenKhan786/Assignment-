const { body } = require("express-validator/check");

const postTaskValidation = [
  body("taskTitle")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Task Title should be atleast 4 characters!"),
  body("taskDescription")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Task Description should be atleast 10 characters!"),
  body("dateOfTask")
    .trim()
    .isDate()
    .withMessage("Date should be of the format yyyy/mm/dd or yyyy-mm-dd "),
  body("status")
    .trim()
    .notEmpty()
    .custom((value, { req }) => {
      const val = value.toLowerCase().toString();
      if (val === "completed" || val === "wip" || val === "delayed") {
        return Promise.resolve();
      } else {
        return Promise.reject(
          "Status can only take the value : Completed, Delayed, WIP"
        );
      }
    }),
]

const patchTaskValidation  =  [
  body("taskTitle")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Task Title should be atleast 4 characters!")
    .optional(),
  body("taskDescription")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Task Description should be atleast 10 characters!")
    .optional(),
  body("dateOfTask")
    .trim()
    .isDate()
    .withMessage("Date should be of the format yyyy/mm/dd or yyyy-mm-dd ")
    .optional(),
  body("status")
    .trim()
    .notEmpty()
    .optional()
    .custom((value, { req }) => {
      const val = value.toLowerCase().toString();
      if (val === "completed" || val === "wip" || val === "delayed") {
        return Promise.resolve();
      } else {
        return Promise.reject(
          "Status can only take the value : Completed, Delayed, WIP"
        );
      }
    }),
]

const postSignInValidation =  [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email!")
    .normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password should atleast have 6 characters!"),
]

const putSignUpValidation =   [
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
]


module.exports.postTaskValidation = postTaskValidation;
module.exports.patchTaskValidation = patchTaskValidation;
module.exports.putSignUpValidation = putSignUpValidation;
module.exports.postSignInValidation = postSignInValidation;



