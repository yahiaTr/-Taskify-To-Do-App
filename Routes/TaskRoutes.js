const VerifyTokenAndRole = require("../middlewares/VerifyTokenMiddleware");
const { AddTask, EditTask, GetTask, GetTasksByStatus, DeleteTask, GetAllTasks } = require("../controllers/TaskController");
const express = require("express");
const router = express.Router();

router.post("/add-task" , VerifyTokenAndRole(["User"]) , AddTask);
router.put("/update-task/:id" , VerifyTokenAndRole(["User"]) , EditTask);
router.delete("/delete-task/:id" , DeleteTask);
router.get("/task/:id" , VerifyTokenAndRole(["User"]) , GetTask);
router.get("/tasks-status" , VerifyTokenAndRole(["User"]) , GetTasksByStatus);
router.get("/all-tasks" , VerifyTokenAndRole(["User"]) , GetAllTasks);

module.exports = router;