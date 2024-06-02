require("dotenv").config()
const express = require("express")
const mainRouter = require("./Router/mainRoute")
const authRouter = require("./Router/authRouter")
const app = express()
const cors = require('cors')
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser())

const allowedOrigins = [
  'http://localhost:5173',
  'https://serflow.netlify.app/login',
  'https://serflow.netlify.app'
];


app.use(cors({
    origin:(origin, callback) => {
      if (!origin) return callback(null, true);
  
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true // Allow cookies to be sent with requests
  }));
app.use("/auth", authRouter)
app.use("/main", mainRouter)

module.exports = app