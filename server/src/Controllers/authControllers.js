require('dotenv').config();
const User = require('../Models/userSchema');
const jwt = require('jsonwebtoken'); 
const OTP = require('./../Models/otpSchema')
const sendEmail = require('./OTPEmailVerification');
const {createChatUser} = require('./chatControllers.js');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  // console.log(token)
  
    if (!token) return res.status(401).json({ message: 'Access token is missing' });
  
    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Access token expired' });
        }
        return res.status(401).json({ message: 'Access token is invalid' });
      }  
      req.user = user;
      next();
    });
  };

// signup

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res
          .status(400)
          .json({
            error: "User with the provided email or username already exists",
          });
      }
  
      const newUser = new User({ username, email });
  
      newUser.setPassword(password);
  
      const savedUser = await newUser.save();

      await sendEmail(email, savedUser);

      if (!res.headersSent) {
        res.status(200).json({ success: true, message: 'OTP sent successfully', email : savedUser.email});
      }
  
      // res.status(201).json({ message: "User successfully created" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
}


const verifyOTP = async (req, res) => {

    const { email, otp } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
      if(user.isVerified){
        return res.status(409).json({ error: 'User already verified' });
      }
      const otpCode = await OTP.findOne({ userID: user._id });
      if (!otpCode || !(await otpCode.validateOTP(otp.toString()))) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }
      
      user.isVerified = true;
      await user.save();

      await createChatUser(user.username, user._id.toString(), user.email, user.username);
      
      return res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
}


const resendOTP = async(req,res) => {
    const { email } = req.body;
    console.log(email);
  
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
      
      const emailRes = await sendEmail(email, user);
      if (!emailRes) {
        return res.status(500).json({ error: 'Error sending email' });
      }
      return res.status(200).json({ message: "OTP Re-sent Successfully" });
    } catch (error) {
      console.error('Error resending OTP:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
}

const authenticateUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user || !user.validatePassword(password)) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      if (!user.isVerified) {
        return res.status(403).json({ error: "User not verified. Check Email to verify." });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: "1h" });
      res.status(200).json({ userName: user.username, userId: user._id, token: token, profileImage: user.image });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
}

const getUser = async(req,res) => {
    const token = req.headers.authorization.split(" ")[1];
    const { userId } = jwt.verify(token, process.env.SECRET);
    
    try {
      const user = await User.findById(userId);
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
}

const updateProfileImage = async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const { userId } = jwt.verify(token, process.env.SECRET);
    const { profileImage } = req.body;
    // console.log(profileImage);
    try {
      const user = await User.findByIdAndUpdate(userId, { image: profileImage }, { new: true });
      res.status(200).json({ profileImage: user.image });
    } catch (error) {
      console.error("Error updating profile image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
}
const verifyOTPPasswordReset = async (req, res, next) => {
  console.log("verifiyng otp")
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const otpCode = await OTP.findOne({ userID: user._id });
    if (!otpCode || !(await otpCode.validateOTP(otp.toString()))) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    req.otpData = { email, otp };
    console.log("verified otp")

    return next();

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const resetPasswordMiddleware = async (req, res, next) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const newPassword = req.body.newPassword;

  console.log(email, otp, newPassword)

  try {
      const user = await User.findOne({ email: email });
      if (!user) {
          return res.status(400).json({ error: 'User not found' });
      }
      user.setPassword(newPassword);
      await user.save();
      req.passwordResetSuccess = true;
      next();
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { authenticateToken, registerUser, verifyOTP, resendOTP, authenticateUser, getUser, updateProfileImage, verifyOTPPasswordReset, resetPasswordMiddleware };