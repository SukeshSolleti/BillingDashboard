const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/User");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to send reset password email
const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    const transporter = nodemailer.createTransport({
      // Configure your email provider here
      service: "gmail",
      auth: {
        user: "sukesh.solleti.adtran@gmail.com",
        pass: "jszeajblzxviwwhq",
      },
    });

    const mailOptions = {
      from: "sukesh.solleti.adtran@gmail.com",
      to: email,
      subject: "Reset Your Password",
      html: `
                <p>You are receiving this email because you (or someone else) has requested to reset the password for your account.</p>
                <p>Please click on the following link to reset your password:</p>
                <a href="http://localhost:3000/reset-password?token=${resetToken}">Reset Password Link</a>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw new Error("An error occurred while sending the reset password email");
  }
};

// userController.js
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    await sendResetPasswordEmail(email, resetToken);

    return res
      .status(200)
      .json({ message: "Reset password email sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while processing your request" });
  }
};
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  // Ensure token and password are provided
  if (!token || !password) {
    return res.status(400).json({ message: "Token and password are required" });
  }

  try {
    console.log("Finding user with reset token");
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Invalid or expired token");
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired." });
    }

    console.log("Hashing new password");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    console.log("Saving new password to the user");
    await user.save();

    console.log("Password reset successfully");
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ message: "An error occurred while resetting the password" });
  }
};

const verifyToken = (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(200).json({ message: "Token is valid", user: decoded });
  });
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyToken,
};
