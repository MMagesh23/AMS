const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hidden Admin Register Route
exports.registerAdmin = async (req, res) => {
  const { userID, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match" });

  const existingUser = await User.findOne({ userID });
  if (existingUser) return res.status(400).json({ message: "Admin already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ userID, password: hashedPassword, role: 'admin' });
  await user.save();

  res.status(201).json({ message: 'Admin registered successfully' });
};

// Login for Admin & Teacher
exports.login = async (req, res) => {
  const { userID, password } = req.body;
  const user = await User.findOne({ userID });

  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1hr" });

  res.json({ token, role: user.role });
};

// Change Admin Password
exports.changePassword = async (req, res) => {
  const { userID, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

  const user = await User.findOne({ userID, role: 'admin' });
  if (!user) return res.status(404).json({ message: "Admin not found" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: 'Password updated successfully' });
};