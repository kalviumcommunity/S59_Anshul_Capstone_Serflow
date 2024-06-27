const {Server} = require("socket.io");
const {checkIfUnread} = require("../Controllers/chatControllers");

let onlineUsers = [];
let io;

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

const createWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', process.env.FRONTEND_URL],
      // methods: ['GET', 'POST'],
      // credentials: true,
    }
  })

  io.on("connection", (socket) => {
    socket.on("newUser", (username) => {
      addNewUser(username, socket.id);
      console.log(`User Connected : ${username} , Socket ID : ${socket.id}`);
    });
  
    socket.on("checkUnreads", ({ username, secret}) => {
      const receiver = getUser(username);
      checkIfUnread(process.env.CHAT_ENGINE_PROJECT_ID, username, secret).then(({count, data}) => {
        console.log("Unread Messages : ", count, "data : ", data);
        io.to(receiver.socketId).emit("unreads", {
          count,
          data
        });
      });
      
    });
  
    socket.on("sendText", ({ senderName, receiverName, text }) => {
      const receiver = getUser(receiverName);
      io.to(receiver.socketId).emit("getText", {
        senderName,
        text,
      });
    });
  
    socket.on("disconnect", () => {
      removeUser(socket.id);
    });
  });
}


module.exports = {createWebSocket};