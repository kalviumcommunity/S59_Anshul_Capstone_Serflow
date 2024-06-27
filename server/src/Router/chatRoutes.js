const axios = require("axios");
const express = require("express");
const router = express.Router();
const {authenticateToken} = require("./../Controllers/authControllers");
const User = require("../Models/userSchema");

router.post("/getUser", authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId);
  // console.log(user.username, req.user.userId);
  try {
    const r = await axios.get("https://api.chatengine.io/users/me/", {
      headers: {
        "Project-ID": process.env.CHAT_ENGINE_PROJECT_ID,
        "User-Name": user.username,
        "User-Secret": req.user.userId,
      },
    });
    return res.status(r.status).json({chatData : r.data, secret : req.user.userId});
  } catch (e) {
    if (e.response) {
      return res.status(e.response.status).json(e.response.data);
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
});


module.exports = router;