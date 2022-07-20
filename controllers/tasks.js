const Task = require("../models/tasks");
const { validationResult } = require("express-validator/check");

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
    error.message = errors.array();
    error.result = [];
    
    next(error)
  }

  const name = req.body.name;
  const email = req.body.email;
  const taskTitle = req.body.taskTitle;
  const taskDescription = req.body.taskDescription;
  const dateOfTask = req.body.dateOfTask;
  const status = req.body.status;

  const task = new Task({
    name: name,
    email: email,
    taskTitle: taskTitle,
    taskDescription: taskDescription,
    dateOfTask: dateOfTask,
    status: status,
  });

  task
    .save()
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Task created succesfully",
        result: task,
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
    error.message = errors.array();
    error.result = [];
    next(error)

  }

  const taskId = req.params.taskId;
  const updatedName = req.body.name;
  const updatedEmail = req.body.email;
  const updatedTaskTitle = req.body.taskTitle;
  const updatedTaskDescription = req.body.taskDescription;
  const updatedDateOfTask = req.body.dateOfTask; 
  const updatedStatus = req.body.status;
 

  const keys = Object.keys(req.body);
  let result= [];
  keys.map((key,i)=>{

    if(key === 'name' || key ==='email' ||  key ==='status' || key ==='dateOfTask' ||  key ==='taskTitle' ||  key ==='taskDescription'){
      result[i] = true;
    } 
    else{
      result[i] = false; 
    }
  })


if(result.includes(false)){
    const error = new Error("Invalid keys! We expect the keys: name, email, taskTitle, taskDescription, dateOfTask, status");
    error.statusCode = 422;
    error.success = false;
    error.message = "Invalid keys! We expect the keys: name, email, taskTitle, taskDescription, dateOfTask, status"
    error.result = [];
    throw error;
  }

  Task.findById(taskId) 
    .then((task) => {
      task.name = updatedName ? updatedName : task.name;
      task.email = updatedEmail ? updatedEmail : task.email;
      task.taskTitle = updatedTaskTitle ? updatedTaskTitle : task.taskTitle;
      task.taskDescription = updatedTaskDescription
        ? updatedTaskDescription
        : task.taskDescription;
      task.dateOfTask = updatedDateOfTask ? updatedDateOfTask : task.dateOfTask;
      task.status = updatedStatus ? updatedStatus : task.status;
      return task.save();
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        result: result,
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

      return Task.findByIdAndDelete(taskId);
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
