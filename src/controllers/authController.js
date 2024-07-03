const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const JWT_SECRET = process.env.JWT_SECRET;
//Registeration Route
exports.register = async (req, res) => {
  try {
    //extracting data from request body
    const { username, email, password, name, profilePicture } = req.body;

    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let userProfilePhoto = profilePicture;
    if (!userProfilePhoto) {
      userProfilePhoto = "";
    }

    //hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      name,
      profilePicture: userProfilePhoto,
    });

    if (!profilePicture) {
      newUser.profilePicture = newUser.avatar;
    }

    //save user to database
    await newUser.save();

    //send response
    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyValue) {
      res
        .status(400)
        .json({ message: "User with same credentials already exists." });
    } else {
      // Other error (e.g., validation error, server issue)
      console.error("Error creating user:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

//Login Route
exports.login = async (req, res) => {
  try {
    //extracting data from request body
    const { email, password } = req.body;

    //check if user exists
    const user = await User.findOne({ email });

    //if user does not exists or wrong password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
    // console.log("JWT_SECRET:", JWT_SECRET);
    const token = jwt.sign({ userID: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    //respond with
    res.status(200).json({ message: "User Logged In Successfully", token });
  } catch (err) {
    console.error("Error logging in user", err);
    res.status(500).json({ message: "Server Error" });
  }
};
