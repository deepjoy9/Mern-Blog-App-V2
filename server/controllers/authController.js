const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: "Please fill in all fields !!" });
  }
  // Validate username length
  if (username.length < 4 || username.length > 20) {
    return res
      .status(400)
      .json({ error: "Username should be between 4 and 20 characters long." });
  }

  // Validate password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password should be at least 6 characters long." });
  }

  try {
    // Check if username or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        error:
          "Username or email already exists. Please choose a different one.",
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const userDoc = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    console.error("Error registering user:", error);

    res
      .status(500)
      .json({ error: "Registration failed. Please try again later." });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required !!" });
    }
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res
        .status(400)
        .json({ error: "Invalid username or password. Please try again." });
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (!passOk) {
      return res
        .status(400)
        .json({ error: "Invalid username or password. Please try again." });
    }

    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) {
        console.error("Error generating JWT:", err);
        return res
          .status(500)
          .json({ error: "Internal Server Error. Please try again later." });
      }

      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie("token", token, {
          sameSite: "none",
          secure: true,
          expires: expiryDate,
        })
        .json({
          id: userDoc._id,
          username,
        });
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.profile = (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "Token is not valid" });
    }
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) {
        console.error("Error verifying token:", err);
        return res.status(401).json({ error: "Token is not valid" });
      }
      res.json(info);
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.logout = (req, res) => {
  try {
    res
      .clearCookie("token", {
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json("Logout success!");
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
