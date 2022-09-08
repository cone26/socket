const socket = io();

const welcome = document.getElementById("welcome");
const roomForm = welcome.querySelector("#roomname");
const room = document.getElementById("room");
const nameForm = welcome.querySelector("#name");

room.hidden = true;

let roomName = "";

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function showRoom() {
  const h3 = room.querySelector("h3");
  welcome.hidden = true;
  room.hidden = false;
  h3.innerText = `Room ${roomName}`;
  const messageForm = room.querySelector("#msg");
  messageForm.addEventListener("submit", handleMessageSubmit);
}

function handleNicknameSubmit(e) {
  e.preventDefault();
  const input = welcome.querySelector("#name input");
  socket.emit("nickname", input.value);
  input.value = "";
}
function handleRoomSubmit(e) {
  e.preventDefault();
  const input = roomForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

function handleMessageSubmit(e) {
  e.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You : ${value}`);
  });
  input.value = "";
}
// messageform 이벤트를 show function 안에서 만드는 이유는?? 밖에서 만ㄷ느는 것과 차이점은?
roomForm.addEventListener("submit", handleRoomSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome", (nick) => {
  addMessage(`${nick} joined !`);
});

socket.on("bye", (nick) => {
  addMessage(`${nick} left :(`);
});

socket.on("new_message", addMessage);
socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
