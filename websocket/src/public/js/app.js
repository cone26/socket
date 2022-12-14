const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nicknameForm = document.querySelector("#nick");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}
socket.addEventListener("open", () => {
  console.log("Connected to the Server ☑️");
});
socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerHTML = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from the Server ❌");
});

function handleSubmit(e) {
  e.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
}
function handleNickSubmit(e) {
  e.preventDefault();
  const input = nicknameForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
}
messageForm.addEventListener("submit", handleSubmit);
nicknameForm.addEventListener("submit", handleNickSubmit);
