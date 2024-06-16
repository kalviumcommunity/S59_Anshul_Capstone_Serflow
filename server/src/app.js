require("dotenv").config()
const express = require("express")
const mainRouter = require("./Router/mainRoute")
const authRouter = require("./Router/authRouter")
const googleAuth = require("./Router/googleAuth")
const app = express()
const cors = require('cors')
const passport = require('passport')
const session = require('express-session');
require('./Controllers/passport-config');
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());  


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser())

const allowedOrigins = [
  'http://localhost:5173',
  'https://serflow.netlify.app'
];


app.use(cors({
  origin: true,
  credentials: true
}));

app.use('/oauth',googleAuth)
app.use("/auth", authRouter)
app.use("/main", mainRouter)


module.exports = app