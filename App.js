const express = require("express");
const connectDB = require("./config/config");
const authRoutes = require("./Routes/AuthRoutes");
const userRoutes = require("./Routes/UserRoutes");
const taskRoutes = require("./Routes/TaskRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
connectDB();
const port = process.env.Port || 5000;

app.use(express.json());


app.use("/api/users" , authRoutes);
app.use("/api/users" , userRoutes);
app.use("/api/tasks" , taskRoutes);

app.listen(port , ()=> {
    console.log(`server is running on port ${port}`);
}) 