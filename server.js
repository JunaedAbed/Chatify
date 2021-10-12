const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// run when a client connects
io.on("connection", (socket) => {
  //   welcome current user
  socket.emit("msg", "Welcome to Chatify");

  //   broadcast when a user connects
  socket.broadcast.emit("msg", "A user has joined the chat");

  //   when client disconnects
  socket.on("disconnect", () => {
    io.emit("msg", "A user has left the chat");
  });

  //   listen for chatMsg
  socket.on("chatMsg", (msg) => {
    io.emit("msg", msg);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
