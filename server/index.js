require("dotenv").config()
const express = require("express")
const http = require("http")
const app = require("./src/app")
const PORT  = process.env.PORT || 5000
const scheduleEmailVerification = require('./src/Scheduled-Mail/VerificationRemainder');
const {createWebSocket} = require('./src/Socket/Socket')
const connectToMongo = require("./src/Controllers/ConnectToMongo")
connectToMongo()

const socketServer = http.createServer(app)
createWebSocket(socketServer)

// 
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  scheduleEmailVerification();
  socketServer.listen(PORT + 1, () => {
    console.log(`Socket Server is running on port ${PORT + 1}`); //port is taken from env and in just incremented to accomodate soket server
  })
  });
  
  
  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
  });

