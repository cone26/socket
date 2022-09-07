import express from "express";
import http from "http";
import SocketIO from "socket.io";
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const server = http.createServer(app);
const io = SocketIO(server);

io.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("new_message", (msg, roomName, done) => {
    socket.to(roomName).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname));
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

// function onSocketClose() {
//   console.log("Disconnected from the Browser");
// }

// fake DB
// const sockets = [];

// wss.on("connection", (socket) => {
//   console.log("Connected to the Client ☑️");
//   sockets.push(socket);
//   socket["nickname"] = "Anonymous";
//   socket.on("close", onSocketClose);
//   socket.on("message", (msg) => {
//     const parsed = JSON.parse(msg);
//     // 스위치문으로 바꿔보기 => 지금은 먼가 에러남 ;;
//     // switch (parsed.type) {
//     //   case "new_message":
//     //     const message = parsed.payload;
//     //     sockets.forEach((aSocket) => aSocket.send(message.toString()));
//     //   case "nickname":
//     //     console.log("it's nickname");
//     // }
//     if (parsed.type === "new_message") {
//       const message = parsed.payload;
//       sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.toString()}`));
//       //
//     } else {
//       socket["nickname"] = parsed.payload;
//     }
//   });
// });

server.listen(3000, handleListen);
