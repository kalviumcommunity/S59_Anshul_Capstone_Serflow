require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../Models/userSchema');
const jwt = require('jsonwebtoken'); 

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token is missing' });

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Access token expired' });
      }
      return res.status(403).json({ message: 'Access token is invalid' });
    }

    req.user = user;
    next();
  });
};

// signup
router.post("/signup", async (req, res) => {
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
  
      await newUser.save();
  
      res.status(201).json({ message: "User successfully created" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // User Authentication
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
  
      if (!user || !user.validatePassword(password)) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: "1h" });
      const cookieOptions = {
      httpOnly: false,
      // path: '/Dashboard',
      // domain: process.env.NODE_ENV === 'production' ? 'serflow.netlify.app' : 'localhost',
      maxAge: 60 * 60 * 1000, // 1 hour
      secure: process.env.NODE_ENV === 'production', // Set Secure attribute if in production
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax' // Set SameSite to None if needed
    };

    // res.cookie("token", token, cookieOptions);
    // res.cookie("userName", user.username, { ...cookieOptions, httpOnly: false }); // userName cookie does not need to be httpOnly


      res.status(200).json({ userName: user.username, userId: user._id, token : token, profileImage: user.image});
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  // User Object
  console.log()
  router.get("/user",authenticateToken, async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const { userId } = jwt.verify(token, process.env.SECRET);
    // console.log(userId);
    try {
      const user = await User.findById(userId);
      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update Profile Image
  router.patch("/user", async (req, res) => {
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
  });

  module.exports = router;