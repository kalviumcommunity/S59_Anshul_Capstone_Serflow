require("dotenv").config()
const express = require("express")
const mainRouter = require("./Router/mainRoute")
const authRouter = require("./Router/authRouter")
const app = express()
const cors = require('cors')
app.use(express.json());
app.use(cors())
app.use("/auth", authRouter)
app.use("/main", mainRouter)

module.exports = app