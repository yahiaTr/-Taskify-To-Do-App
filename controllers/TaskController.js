const Task = require("../models/TaskModel");
const User = require("../models/UserModel");

const AddTask = async (req, res) => {
    try {
        const { userId , title, description, priority, status, dueDate } = req.body;
        
        const errors = {};
        if (!title) errors.title = "title is required";
        if (!description) errors.description = "description is required";
        if (!priority) errors.priority = "priority is required";
        if (!status) errors.status = "status is required";
        if (!dueDate) errors.dueDate = "dueDate is required";

        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }

        const newTask = new Task({
            title,
            description,
            dueDate,
            priority,
            status
        });

        await newTask.save();

        const user = await User.findById(userId);
        user.tasks.push(newTask._id);
        await user.save();

        res.status(201).json({ message: "Task added successfully", task: newTask });

    } catch (error) {
        console.error("Error adding task :", error);
        res.status(500).json({ message: "Something went wrong while adding the task" });
    }
};



const EditTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, status } = req.body;
        const updatedData = {};

        if (title) updatedData.title = title;
        if (description) updatedData.description = description;
        if (dueDate) updatedData.dueDate = dueDate;
        if (priority) updatedData.priority = priority;
        if (status) updatedData.status = status;

        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: "At least one field is required to update" });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Something went wrong while updating the task" });
    }
};



const DeleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne();

        await User.updateOne(
            { tasks: task._id },
            { $pull: { tasks: task._id } }
        );

        res.status(200).json({ message: "Task deleted successfully" });

    } catch (error) {
        console.error("Error deleting task :", error);
        res.status(500).json({ message: "Something went wrong while deleting the task" });
    }
};

const GetTask = async(req,res) => {
    try{
    const task = await Task.findById(req.params.id);

    if(!task) return res.status(400).json({message : "task not found"});

    res.status(200).json(task);

}catch(error){
    res.status(500).json({message : "something went wrong while getting the task"});
}
}

const GetTasksByStatus = async (req, res) => {
    const { userId, status } = req.body; 
    
    try {

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const tasks = await Task.find({ 
            _id: { $in: user.tasks }, 
            status: status 
        });

        if (tasks.length === 0) {
            return res.status(400).json({ message: "No tasks found for this user with the given status" });
        }

        res.status(200).json(tasks);

    } catch (error) {
        console.error("Error getting tasks :", error);
        res.status(500).json({ message: "Something went wrong while getting tasks" });
    }
};



const GetAllTasks = async (req, res) => {
    const { userId } = req.body; 

    try {

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId).populate("tasks");

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.tasks.length === 0) {
            return res.status(400).json({ message: "No tasks found for this user" });
        }

        res.status(200).json(user.tasks);

    } catch (error) {
        console.error("Error getting tasks:", error);
        res.status(500).json({ message: "Something went wrong while getting tasks" });
    }
};

module.exports = {
    AddTask,
    EditTask,
    DeleteTask,
    GetTask,
    GetTasksByStatus,
    GetAllTasks
}