const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.querySelector("#mute");
const cameraBtn = document.querySelector("#camera");
const cameraSelect = document.querySelector("#cameras");

const welcome = document.querySelector("#welcome");
const call = document.querySelector("#call");

call.hidden = true;

let myStream;
let muted = false;
let cameraoff = false;
let roomName;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label == camera.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstrainsts = {
    audio: true,
    video: { deviceid: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(deviceId ? cameraConstrainsts : initialConstrains);
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
}
function handleMuteClick() {
  myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}
function handleCameraClick() {
  myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
  if (cameraoff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraoff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraoff = true;
  }
}
async function handleCameraChange() {
  await getMedia(cameraSelect.value);
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);

// welcome
const welcomeFrom = welcome.querySelector("form");

function startMedia() {
  welcome.hidden = true;
  call.hidden = false;
  getMedia();
}
function handleWelcomeSubmit(e) {
  e.preventDefault();
  const input = welcomeFrom.querySelector("input");
  socket.emit("join_room", input.value, startMedia);
  roomName = input.value;
  input.value = "";
}
welcomeFrom.addEventListener("submit", handleWelcomeSubmit);

//socket
socket.on("welcome", () => {
  console.log("someone joined");
});
