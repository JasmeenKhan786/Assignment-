const express = require("express");
const router = express.Router();

const validation = require("../functions/validationFunctions");

const taskController = require("../controllers/tasks");

const isAuth = require("../middleware/authMiddleware");

router.get("/", isAuth, taskController.getTasks);

router.post("/createTask", isAuth, validation.postTaskValidation, taskController.postTask);

router.patch("/updateTask/:taskId", isAuth, validation.patchTaskValidation, taskController.updateTask);

router.delete("/deleteTask/:taskId", isAuth, taskController.deleteTask);

module.exports = router;
