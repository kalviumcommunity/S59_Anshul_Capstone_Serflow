require('dotenv').config();
const express = require('express');
const router = express.Router();

const { authenticateToken, registerUser, verifyOTP, resendOTP, authenticateUser, getUser, updateProfileImage } = require('../Controllers/authControllers');


// signup
router.post("/signup", registerUser)

// OTP VERIFICATION
router.post('/verify-otp', verifyOTP)


// Resend OTP 
router.post('/resend-otp', resendOTP);


// User Authentication
router.post("/login", authenticateUser);


// User Object
router.get("/user", authenticateToken, getUser);

// Update Profile Image
router.patch("/user", authenticateToken, updateProfileImage);

module.exports = router;