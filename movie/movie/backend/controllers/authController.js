const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/auth");

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide name, email and password" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const user = await User.create({ name, email, password, phone: phone || "" });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      data: { user: userObj, token: generateToken(user._id) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      success: true,
      data: { user: userObj, token: generateToken(user._id) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (currentPassword && newPassword) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
      }
      user.password = newPassword; // pre-save hook will hash it
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json({ success: true, data: userObj });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error updating profile" });
  }
};

module.exports = { register, login, getMe, updateProfile };
