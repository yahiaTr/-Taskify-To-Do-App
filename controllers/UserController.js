const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

const DeleteUser = async(req,res) => {
    try{
    const user = await User.findById(req.params.id);

    if(!user) return res.status(400).json({message : "user not found"});

    await user.deleteOne();

    }catch(error){
        res.status(500).json({message : "something went wrong while deleting the user"});
    }
}


const EditUser = async (req, res) => {
    try {
        const { name, email, password, passwordC } = req.body;
        const updatedData = {};

        // التحقق من وجود بيانات أساسية
        if (!name && !email && !password) {
            return res.status(400).json({ message: "At least one of name, email, or password is required" });
        }

        // التحقق من تطابق كلمات المرور
        if (password !== passwordC) {
            return res.status(400).json({ passwordC: "Passwords do not match" });
        }

        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return res.status(400).json({ message: "Email is already in use by another user" });
            }
            updatedData.email = email;
        }

        if (name) updatedData.name = name;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updatedData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong while updating the user" });
    }
};

const GetUser = async(req,res) => {
    try{
    const user = await User.findById(req.params.id);

    if(!user) return res.status(400).json({message : "user not found"});

    res.status(200).json(user);

}catch(error){
    res.status(500).json({message : "something went wrong while getting the user"});
}
}

const GetAllUsers = async (req, res) => {
    try {

        const users = await User.find({ role: "User" });

        if (users.length === 0) {
            return res.status(400).json({ message: "There are no users with role 'User'" });
        }

        res.status(200).json(users);

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Something went wrong while getting all users" });
    }
};



module.exports = {
    DeleteUser,
    EditUser,
    GetUser,
    GetAllUsers
}