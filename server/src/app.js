require("dotenv").config()
const express = require("express")
const mainRouter = require("./Router/mainRoute")
const authRouter = require("./Router/authRouter")
const app = express()
const cors = require('cors')
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's origin
    credentials: true // Allow cookies to be sent with requests
  }));
app.use("/auth", authRouter)
app.use("/main", mainRouter)

module.exports = app