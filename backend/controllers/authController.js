import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyEmail } from "../emailVerify/verifyEmail.js";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1h",
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {

    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }] });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error:
          userExists.email === email
            ? "Email already registered"
            : "Username already taken",
        statusCode: 400,
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    });
    verifyEmail(token, email);
    user.token = token;
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
        token
      },
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
        statusCode: 400,
      });
    }

    // Check for user (include password for comparison)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
        statusCode: 401,
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
        statusCode: 401,
      });
    }

    // Block login if email isn't verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        error: "Please verify your email before logging in",
        statusCode: 403,
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
      },
      token,
      message: "Login successful",
    });

  } catch (error) {
    next(error);
  }
};



// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {

    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {

    const { username, email, profileImage } = req.body;

    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (email) user.email = email;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
      message: "Profile updated successfully",
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Please provide current and new password",
        statusCode: 400,
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
        statusCode: 401,
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    next(error);
  }
};

export const verifyEmailToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    console.log("Received token for verification:", token);
    console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "yes" : "NO - undefined");

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
    } catch (err) {
      console.error("Token verification failed:", err.message);
      return res.status(400).json({
        success: false,
        error: "Invalid or expired verification link",
        statusCode: 400,
      });
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        statusCode: 404,
      });
    }

    console.log("Verified user:", user.email, "isVerified:", user.isVerified);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      isVerified: user.isVerified,
    });
  } catch (error) {
    next(error);
  }
};