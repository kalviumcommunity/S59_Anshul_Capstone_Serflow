require('dotenv').config({path: '.env.test'})

const mongoose = require('mongoose');
const { authenticateToken, registerUser, verifyOTP, resendOTP, authenticateUser, getUser, updateProfileImage } = require('../Controllers/authControllers');
const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }))

  // signup
app.post("/signup", registerUser)
app.post('/verify-otp', verifyOTP)
app.post('/resend-otp', resendOTP);
app.post("/login", authenticateUser);
app.get("/user", authenticateToken, getUser);

module.exports = app;