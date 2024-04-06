const express = require("express");
const router = express.Router();
const {
  register,
  login,
  profile,
  logout,
} = require("../controllers/authController");

// Route for user registration
router.post("/register", register);

// Route for user login
router.post("/login", login);

// Route for fetching user profile
router.get("/profile", profile);

// Route for user logout
router.post("/logout", logout);

module.exports = router;
