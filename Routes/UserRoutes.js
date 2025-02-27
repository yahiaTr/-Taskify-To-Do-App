const { DeleteUser, EditUser, GetUser, GetAllUsers } = require("../controllers/UserController");
const VerifyTokenAndRole = require("../middlewares/VerifyTokenMiddleware");
const express = require("express");
const router = express.Router();


router.delete("/:id" , VerifyTokenAndRole(["Admin"]) , DeleteUser);
router.put("/update-user/:id" , VerifyTokenAndRole(["Admin" , "User"]) , EditUser);
router.get("/user/:id" , VerifyTokenAndRole(["Admin" , "User"]) , GetUser);
router.get("/all-users" ,VerifyTokenAndRole(["Admin"]) , GetAllUsers);

module.exports = router;