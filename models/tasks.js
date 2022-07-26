const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
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
        required:true
    } ,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
      }
});

module.exports = mongoose.model('Task',taskSchema);