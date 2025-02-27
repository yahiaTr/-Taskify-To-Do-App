const User = require("../models/UserModel");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const SignUpUser = async(req,res)=> {

    try{
    const {name , email , password , passwordC} = req.body;
    const errors = {};

    if(!name) return errors.name = "name is required";
    if(!email) return errors.email = "email is required";
    if(!password) return errors.password = "password is required";
    if(password !== passwordC) return errors.passwordC = "passwords do not match";

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);


    const existingEmail = await User.findOne({email});

    const existingName = await User.findOne({name});

    if(existingName) return res.status(400).json({name : "name is used try another one"});

    if(existingEmail) return res.status(400).json({email : "email is used try another one"});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password , salt);

    const newUser = new User({
        name,
        email,
        password : hashedPassword
    })

    await newUser.save();

    const token = jwt.sign({userId : newUser._id , role : newUser.role} , "secretKey");

    res.status(200).json({newUser , token});

}catch(error){
    console.log("signup Error : " , error);
    res.status(500).json({message : "something went wrong"});
}
}


const LoginUser = async (req, res) => {
    try {
        const errors = {};
        const { name, email, password } = req.body;

        if (!name) errors.name = "name is required";
        if (!email) errors.email = "email is required";
        if (!password) errors.password = "password is required";

        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ email: "invalid email or password" });
        }

        if (existingUser.name !== name) {
            return res.status(400).json({ name: "name is not found" });
        }

        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            return res.status(400).json({ password: "invalid email or password" });
        }

        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role },"secretKey"
        );

        res.status(200).json({ user: existingUser, token });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


module.exports = {
    SignUpUser,
    LoginUser
}
