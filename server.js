const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMsg = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Chatify Bot";

// run when a client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //   welcome current user
    socket.emit("msg", formatMsg(botName, "Welcome to Chatify"));

    //   broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit("msg", formatMsg(botName, `${user.username} has joined the chat`));
  });

  //   listen for chatMsg
  socket.on("chatMsg", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("msg", formatMsg(user.username, msg));
  });
  //   when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "msg",
        formatMsg(botName, `${user.username} has left the chat`)
      );
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
