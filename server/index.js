require("dotenv").config()
const express = require("express")
const app = require("./src/app")
const PORT  = process.env.PORT || 5000
const scheduleEmailVerification = require('./src/Scheduled-Mail/VerificationRemainder');

const connectToMongo = require("./src/Controllers/ConnectToMongo")

connectToMongo()

// 
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    scheduleEmailVerification();
  });
  
  
  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
  });

