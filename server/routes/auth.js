import express from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

import authMiddleware from './users.js';
import { LocalStorage } from "node-localstorage";

dotenv.config()

const router = express.Router();
global.localStorage = new LocalStorage('./localStorage');

function validatePassword(user, password) {
  return bcrypt.compare(password, user.password);
}


// register route
router.post('/', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email address already in use' });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    const existingUserByNameAndEmail = await User.findOne({ name, email });
    if (existingUserByNameAndEmail) {
      return res
        .status(400)
        .json({ error: 'User with this name and email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, username, password: hashedPassword });
    const token = jwt.sign({ email: email }, 'forsenbruh');

    await user.save();

    res.json({ message: 'User created', user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save user' });
  }
});


// login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const isValidPassword = await validatePassword(user, password);
  const token = jwt.sign({ email: email }, 'forsenbruh')
  if (!isValidPassword) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  res.json({ message: 'Login successful', user, token: token });

//  const userId = user._id; // Get the user ID from the user object
//  localStorage.setItem('userId', userId); // Save the userId to node-localstorage
});

//secure route
router.get('/test', authMiddleware, (req, res) => {
  res.send('secret number 10');
})


//logout route
router.post('/logout', (req, res) => {
  // Clear the user session
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to logout' });
    } else {
      res.json({ message: 'Logout successful' });
    }
  });
});


// get user by id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get user' });
  }
});







// forgot password route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // generate password reset token
  const token = uuidv4();
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // token expires in 1 hour
  await user.save();

  // send password reset email
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset',
    text: `To reset your password, click on the following link: http://localhost:5173/reset-password/${token}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to send password reset email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ message: 'Password reset email sent' });
    }
  });
});

// reset password route
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});




export default router;
