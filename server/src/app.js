require("dotenv").config()
const express = require("express")
const mainRouter = require("./Router/mainRoute")
const app = express()

app.use(express.json());

app.use("/main", mainRouter)

module.exports = app