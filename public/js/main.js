const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// join chatroom
socket.emit("joinRoom", { username, room });

// get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// msg from server
socket.on("msg", (msg) => {
  console.log(msg);
  outputMessage(msg);

  //   scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// msg submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //   get msg text
  const msg = e.target.elements.msg.value;

  //   emit msg to the server
  socket.emit("chatMsg", msg);

  //   clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// output msg to DOM
function outputMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
            <p class="text">
              ${msg.text}
            </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// add roomname to dom
function outputRoomName(room) {
  roomName.innerText = room;
}

// add users to dom
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
