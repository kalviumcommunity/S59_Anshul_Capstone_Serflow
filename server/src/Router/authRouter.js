require('dotenv').config();
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const {
    authenticateToken,
    registerUser,
    verifyOTP,
    resendOTP,
    authenticateUser,
    getUser,
    updateProfileImage,
    verifyOTPPasswordReset,
    resetPasswordMiddleware,
    renderForgotPasswordPage, handleForgotPasswordRequest, renderVerifyResetOTPPage, handleVerifyResetOTPRequest, renderResetPasswordPage, handleResetPasswordRequest, renderResetSuccessPage
} = require('../Controllers/authControllers');

const {getUserData} = require('../Controllers/redisClient');

const resendOtpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: {
      status: 429,
      message: "Too many requests, please try again later."
    }
});

// Signup
router.post("/signup", registerUser);

// OTP Verification
router.post('/verify-otp', verifyOTP);

// Resend OTP
router.post('/resend-otp', resendOtpLimiter, resendOTP);

// User Authentication
router.post("/login", authenticateUser);

// Get User Object
router.get("/user", authenticateToken,getUserData, getUser);

// Update Profile Image
router.patch("/user", authenticateToken, updateProfileImage);

// Forgot Password Page
router.get('/forgot-password', renderForgotPasswordPage);
router.post('/forgot-password', handleForgotPasswordRequest);

// Verify Reset OTP Page
router.get('/verify-reset-otp', renderVerifyResetOTPPage);
router.post('/verify-reset-otp', verifyOTPPasswordReset,handleVerifyResetOTPRequest);

// Reset Password Page
router.get('/reset-password', renderResetPasswordPage);
router.post('/reset-password', resetPasswordMiddleware, handleResetPasswordRequest);

// Reset Success Page
router.get('/reset-success', renderResetSuccessPage);



module.exports = router;
