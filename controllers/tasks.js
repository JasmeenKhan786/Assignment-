const Task = require("../models/tasks");
const User = require("../models/users");

const { validationResult } = require("express-validator/check");


function checkKeys(actualKeysArray, expectedKeysArray) {
  let missingKeys = actualKeysArray.map((key, i) => {
    if (expectedKeysArray.includes(key)) {
      return null; 
    } else {
      return key;
    }
  });

  missingKeys = missingKeys.filter((key) => {
    return key !== null;
  });

  if (missingKeys.length > 0) {
    //returns false if the keys are invalid or mismatch or we have extra keys
    return { status: false, missingKeys: missingKeys };
  } else {
    //return true if we have correct keys
    return { status: true, missingKeys: [] };
  }
}

exports.getTasks = (req, res, next) => {
  Task.find()
    .then((tasks) => {
      res.status(200).json({
        success: true,
        message: "Fetched all the tasks",
        result: tasks,
      });
    })
    .catch((error) => {
      error.statusCode = 500;
      error.success = false;
      error.message = "Unable to fetch tasks!";
      error.result = [];
      next(error);
    });
};

exports.postTask = (req, res, next) => {

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

  const email = req.email;
  const taskTitle = req.body.taskTitle;
  const taskDescription = req.body.taskDescription;
  const dateOfTask = req.body.dateOfTask;
  const status = req.body.status;
  const userId = req.uid;

  const missingKeys = checkKeys(Object.keys(req.body), [
    "taskTitle",
    "taskDescription",
    "dateOfTask",
    "status",
  ]);
  if (!missingKeys.status) {
    const error = new Error("Invalid keys!");
    error.statusCode = 422;
    error.success = false;
    error.message = "Invalid key - " + missingKeys.missingKeys;
    error.result = [];
    next(error);
  }

  const task = new Task({
    taskTitle: taskTitle,
    taskDescription: taskDescription,
    dateOfTask: dateOfTask,
    status: status,
    userId: userId,
  });

  let taskId;
  task
    .save()
    .then((result) => {
      taskId = result._id;
      return User.findById(userId);
    })
    .then((user) => {
      user.tasks.push(taskId);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Task created succesfully",
        result: [task],
      });
    })
    .catch((error) => {
      error.statusCode = 500;
      error.success = false;
      error.message = "Unable to create task!";
      error.result = [];
      next(error);
    });
};

exports.updateTask = (req, res, next) => {

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

  const taskId = req.params.taskId;
  const userId = req.uid;
  const updatedTaskTitle = req.body.taskTitle;
  const updatedTaskDescription = req.body.taskDescription;
  const updatedDateOfTask = req.body.dateOfTask;
  const updatedStatus = req.body.status;

  const missingKeys = checkKeys(Object.keys(req.body), [
    "taskTitle",
    "taskDescription",
    "dateOfTask",
    "status",
  ]);
  if (!missingKeys.status) {
    const error = new Error("Invalid keys!");
    error.statusCode = 422;
    error.success = false;
    error.message = "Invalid key - " + missingKeys.missingKeys;
    error.result = [];
    throw error;
  }

  Task.findById(taskId)
    .then((task) => {
      if (task.userId.toString() === userId.toString()) {
        task.taskTitle = updatedTaskTitle ? updatedTaskTitle : task.taskTitle;
        task.taskDescription = updatedTaskDescription
          ? updatedTaskDescription
          : task.taskDescription;
        task.dateOfTask = updatedDateOfTask
          ? updatedDateOfTask
          : task.dateOfTask;
        task.status = updatedStatus ? updatedStatus : task.status;
        return task.save();
      } else {
        const error = new Error("User is not authorized to update this task!");
        error.statusCode = 422;
        error.success = false;
        error.message = "User is not authorized to update this task!";
        error.result = [];
        next(error);
      }
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        result: [result],
      });
    })
    .catch((error) => {
      error.statusCode = 422;
      error.success = false;
      error.message = "Unable to update task, Please check the task id!";
      error.result = [];
      next(error);
    });
};

exports.deleteTask = (req, res, next) => {
  const taskId = req.params.taskId;
  Task.findById(taskId)
    .then((task) => {
      if (!task) {
        const error = new Error("Cannot find the task!");
        error.statusCode = 422;
        error.success = false;
        error.message = "Cannot find the task!";
        error.result = [];
        throw error;
      }

      if (task.userId.toString() !== req.uid.toString()) {
        const error = new Error("User is not authorized to delete this task!");
        error.statusCode = 422;
        error.success = false;
        error.message = "User is not authorized to delete this task!";
        error.result = [];
        next(error);
      } 

      return Task.findByIdAndDelete(taskId);

    })
    .then((result) => {
      User.findById(req.uid)
        .then((user) => {
          user.tasks = user.tasks.pull(taskId)
          return user.save();
        })
        .catch((error) => {
          error.statusCode = 500;
          error.success = false;
          error.message = "Cannot find the user!";
          error.result = [];
          next(error);
        });
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
        result: [],
      });
    })
    .catch((error) => {
      error.statusCode = 500;
      error.success = false;
      error.message = "Cannot find the task!";
      error.result = [];
      next(error);
    });
};
