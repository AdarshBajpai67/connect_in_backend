const express = require("express");
const router = express.Router();

const User = require("../models/userModel");
const authController = require("../controllers/authController");

//Registeration Route
router.post("/register", authController.register);

//login route
router.post("/login", authController.login);

module.exports = router;
