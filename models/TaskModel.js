const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title : {type : String , required : true},
    description : {type : String , required : true},
    postedDate : {type : Date , default : Date.now()},
    priority : {type : String , enum : ["low" , "medium" , "high"] , default : "low"},
    dueDate : {type : Date , requried : true},
    status : {type : String , enum : ["panding" , "in-progress" , "completed"]},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"}  
})

const Task = mongoose.model("Task" , taskSchema);

module.exports = Task;
