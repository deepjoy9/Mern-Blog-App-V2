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
  // Validate username format
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(username)) {
    return res
      .status(400)
      .json({ error: "Username can only contain letters and numbers" });
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
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: "Please fill in all fields !!" });
    }
    // Check if the input is an email
    const isEmail = usernameOrEmail.includes("@");

    // Find the user based on email or username
    let userDoc;
    if (isEmail) {
      userDoc = await User.findOne({ email: usernameOrEmail });
    } else {
      userDoc = await User.findOne({ username: usernameOrEmail });
    }
    if (!userDoc) {
      return res
        .status(400)
        .json({ error: "Invalid credentials. Please try again." });
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (!passOk) {
      return res
        .status(400)
        .json({ error: "Invalid credentials. Please try again." });
    }

    jwt.sign(
      { username: userDoc.username, id: userDoc._id },
      secret,
      {},
      (err, token) => {
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
            username: userDoc.username,
            email: userDoc.email,
          });
      }
    );
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
