const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// POST /api/auth/register
router.post(
  '/register',
  [
    body('username').trim().notEmpty().withMessage('Username chahiye'),
    body('password').isLength({ min: 6 }).withMessage('Password kam se kam 6 characters ka hona chahiye'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ success: false, error: 'Username pehle se hai' });
      }
      user = new User({ username, password });
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ success: true, token });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username chahiye'),
    body('password').notEmpty().withMessage('Password chahiye'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, error: 'Galat username ya password' });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ success: true, token });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

module.exports = router;