require("dotenv").config()
const express = require("express")
const app = express()
const mainRouter = require("./src/Router/mainRoute")
const port  = process.env.PORT || 5000

app.use("/main", mainRouter)

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

