require("dotenv").config();
const express = require("express");
const moongose = require("mongoose");

const connectToDB=require("./src/config/db")
const connectToCloudinary = require("./src/config/cloudinary");

const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const postRoutes = require("./src/routes/postRoutes");

const app = express();
app.use(express.json());

connectToDB();
connectToCloudinary();

//routes
app.use("/auth", authRoutes); // auth routes
app.use("/profile", profileRoutes); //profile routes
app.use("/posts", postRoutes); //post Routess

app.get('/',(req,res)=>{
  res.send('server is up and running');
})

//start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
