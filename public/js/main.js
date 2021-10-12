const chatForm = document.getElementById("chat-form");

const socket = io();

// msg from server
socket.on("msg", (msg) => {
  console.log(msg);
  outputMessage(msg);
});

// msg submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //   get msg text
  const msg = e.target.elements.msg.value;

  //   emit msg to the server
  socket.emit("chatMsg", msg);
});

// output msg to DOM
function outputMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
            <p class="text">
              ${msg}
            </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
