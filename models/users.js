const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAuth: {
    type: Boolean,
    default:false
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref:'Task'
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
