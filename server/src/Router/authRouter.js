require('dotenv').config();
const express = require('express');
const router = express.Router();

const { authenticateToken, registerUser, verifyOTP, resendOTP, authenticateUser, getUser, updateProfileImage, verifyOTPPasswordReset, resetPasswordMiddleware } = require('../Controllers/authControllers');

const { sendPasswordResetEmail } = require('./../Controllers/PasswordResetOTP');

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


router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
})
router.post('/forgot-password', async (req, res) => {
    const email = req.body.email;
    console.log("post route: ",email)
    try {
        await sendPasswordResetEmail(email);
        res.redirect(`/auth/verify-reset-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
        res.status(500).send('Error processing your request.');
    }
});


router.get('/verify-reset-otp', (req, res) => {
    const email = req.query.email;
    res.render('verify-reset-otp', { email });
});

router.post('/verify-reset-otp', verifyOTPPasswordReset, async (req, res) => {
    console.log("hello")
    const email = req.otpData.email
    const otp = req.otpData.otp
    console.log(`/auth/reset-password?email=${email}&otp=${otp}`)
    res.redirect(`/auth/reset-password?email=${email}&otp=${otp}`);
});
// 

router.get('/reset-password', (req, res) => {
    const email = req.query.email;
    const otp = req.query.otp
    console.log("get", email, otp)
    res.render('newPassword', { email, otp });
});

router.post('/reset-password', resetPasswordMiddleware, async (req, res) => {
    if (req.passwordResetSuccess) {
        res.redirect('/auth/reset-success');
    } else {
        res.status(500).send('Error resetting password');
    }
});

router.get('/reset-success', (req, res) => {
    res.render('password-reset-success', {frontendUrl: process.env.FRONTEND_URL});
});

module.exports = router;