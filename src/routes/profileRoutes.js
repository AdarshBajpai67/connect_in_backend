const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");

router.put(
  "/update",
  authMiddleware.authenticate,
  profileController.updateProfile
);

module.exports = router;
