const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const mongoose = require("mongoose");

exports.register = async (req, res) => {
  mongoose.connect(process.env.DB_CONNECTION);
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.login = async (req, res) => {
  mongoose.connect(process.env.DB_CONNECTION);
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc) {
    return res.status(400).json({ message: "User not found" });
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    //Logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("Wrong Credentials");
  }
};

exports.profile = (req, res) => {
  mongoose.connect(process.env.DB_CONNECTION);
  const { token } = req.cookies;
  if (!token) {
    // return res.status(401).json({ error: 'Unauthorized' });
    return res.send({ result: 'Token is not valid' });
  }
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
};

exports.logout = (req, res) => {
  res.cookie("token", "").json("ok");
};