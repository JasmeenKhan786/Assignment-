const express = require("express");
const { body, check } = require("express-validator/check");
const router = express.Router();

const taskController = require("../controllers/tasks");

router.get("/", taskController.getTasks);

router.post(
  "/createTask",
  [
    body("name").trim().notEmpty().withMessage("Please enter a valid name!"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email!")
      .normalizeEmail(),
    body("taskTitle")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Task Title should be atleast 4 characters!"),
    body("taskDescription")
      .trim()
      .isLength({ min: 4 })
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
  ],
  taskController.postTask
);

router.patch(
  "/updateTask/:taskId",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Please enter a valid name!")
      .optional(),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email!")
      .normalizeEmail()
      .optional(),
    body("taskTitle")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Task Title should be atleast 4 characters!")
      .optional(),
    body("taskDescription")
      .trim()
      .isLength({ min: 4 })
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
  ],
  taskController.updateTask
);

router.delete("/deleteTask/:taskId", taskController.deleteTask);

module.exports = router;
