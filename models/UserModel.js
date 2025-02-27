const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    email : {
        type : String,
        unique : true,
        required : true
    },

    password : {
        type : String,
        minlength : 8,
        maxlength : 200,
        required : true
    },

    role : {
        type : String,
        enum : ["User" , "Admin"],
        default : "User"
    },

    tasks : [
        {type : mongoose.Schema.Types.ObjectId , ref : "Task"}
    ]
})

const User = mongoose.model("User" , userSchema);

module.exports = User;