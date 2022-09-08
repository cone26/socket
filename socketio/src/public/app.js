const socket = io();

const welcome = document.getElementById("welcome");
const roomForm = welcome.querySelector("#roomname");
const room = document.getElementById("room");
const nameForm = welcome.querySelector("#name");
const h3 = welcome.querySelector("h3");

room.hidden = true;
h3.hidden = true;

let roomName = "";

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const messageForm = room.querySelector("#msg");
  messageForm.addEventListener("submit", handleMessageSubmit);
}

function handleNicknameSubmit(e) {
  e.preventDefault();
  const input = welcome.querySelector("#name input");
  socket.emit("nickname", input.value);
  nameForm.hidden = true;
  h3.hidden = false;
  h3.innerText = `Hi ${input.value} !`;
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

socket.on("welcome", (nick, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${nick} joined !`);
});

socket.on("bye", (nick, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
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
