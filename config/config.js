const mongoose = require("mongoose");

const ConnectDB = async() => {
    try{
    await mongoose.connect("mongodb://localhost:/ToDoApp");
    console.log("connected to mongodb");

    }catch(error){
        console.log("failed to connect to mongodb");
        console.log(".........................");
        console.log(error);
    }

}

module.exports = ConnectDB;