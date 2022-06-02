const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const generateToken = async (user) => {
  const payload = {
    user_id: user._id,
    username: user.username,
  };
};
exports.signin = async (req, res) => {
  try {
    const payload = {
      _id: req.user._id,
      username: req.user.username,
      urls: req.user.urls,
      expires: Date.now() + keys.JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(payload, keys.JWT_SECRET);
    res.status(201).json(token);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.signup = async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 5);
    req.body.password = hashPassword;
    const newUser = await User.create(req.body);
    const payload = {
      _id: newUser._id,
      username: newUser.username,
      urls: newUser.urls,
      expires: Date.now() + keys.JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(payload, keys.JWT_SECRET);
    res.status(201).json(token);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};
