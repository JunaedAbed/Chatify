const chatForm = document.getElementById("chat-form");
const chatMesseges = document.querySelector(".chat-messages");

// get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// join chatroom
socket.emit("joinRoom", { username, room });

// msg from server
socket.on("msg", (msg) => {
  console.log(msg);
  outputMessage(msg);

  //   scroll down
  chatMesseges.scrollTop = chatMesseges.scrollHeight;
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
