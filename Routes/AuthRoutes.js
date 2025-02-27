const {SignUpUser,LoginUser} = require("../controllers/AuthController");
const express = require("express");
const router = express.Router();

router.post("/signup" , SignUpUser);
router.post("/login" , LoginUser);

module.exports = router;