require("dotenv").config();
const express = require("express");
const http = require("http");
const app = require("./src/app");
const PORT = parseInt(process.env.PORT, 10) || 5000;
const scheduleEmailVerification = require('./src/Scheduled-Mail/VerificationRemainder');
const { createWebSocket } = require('./src/Socket/Socket');
const connectToMongo = require("./src/Controllers/ConnectToMongo");

connectToMongo();

const socketServer = http.createServer(app);
createWebSocket(socketServer);

socketServer.listen(PORT + 1, () => {
  console.log(`Socket Server is running on port ${PORT + 1}`);
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  scheduleEmailVerification();
});

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  switch (error.code) {
    case 'EACCES':
      console.error(`${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});
