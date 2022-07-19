const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    taskTitle:{
        type:String,
        required:true
    },
    taskDescription:{
        type:String,
        required:true
    },
    dateOfTask:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'WIP'
    } 
});

module.exports = mongoose.model('Task',taskSchema);