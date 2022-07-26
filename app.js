const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
// const fs = require('fs');
// const path = require('path');

const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");


const MONGO_DB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.nlornpg.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

const app = express();

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );
app.use(helmet());
app.use(compression());
// app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  //these headers will fix the CORS error
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET,POST,PATCH,DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(taskRoutes);
app.use(authRoutes);


app.use("/", (req, res, next) => {
  res.send("Please check your API Call!");
});

app.use((err, req, res, next) => {
  let message;
  console.log(err.message)
  if (Array.isArray(err.message)) {
     message = err.message.map((e) => {
      return e.msg;
    });
  }
  else{
    message = err.message;
    
  }
  res
    .status(err.statusCode)
    .json({ message: message, success: err.success, result: err.result });
});

mongoose
  .connect(MONGO_DB_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
