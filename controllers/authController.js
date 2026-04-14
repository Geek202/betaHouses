const bcrypt = require("bcrypt");
const User = require("../models/userModel");

exports.register = async (req, res) => {
  try {
    const { fullname, username, email, phoneNumber, role, password } = req.body;

    if (!fullname) return res.status(400).json({ message: "fullname is required" });
    if (!username) return res.status(400).json({ message: "username is required" });
    if (!email) return res.status(400).json({ message: "email is required" });
    if (!phoneNumber) return res.status(400).json({ message: "phoneNumber is required" });
    if (!role) return res.status(400).json({ message: "role is required" });
    if (!password) return res.status(400).json({ message: "password is required" });

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      username,
      email,
      phoneNumber,
      role,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) return res.status(400).json({ message: "username is required" });
    if (!password) return res.status(400).json({ message: "password is required" });

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    req.session.user = {
      id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.status(200).json({
      message: "Login successful",
      user: req.session.user
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logged out successfully" });
  });
};

exports.checkAuth = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.status(200).json({
    authenticated: true,
    user: req.session.user
  });
};