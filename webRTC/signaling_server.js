const express = require("express");
const SocketIO = require("socket.io");

const app = express();

var server_port = 5004;
const server = app.listen(server_port, () => {
  console.log("Started on : " + server_port);
});

var io = SocketIO(server, {
  cors: {
    origin: "*",
  },
});

const maxClientsPerRoom = 2;
const roomCounts = {};

io.on("connection", (socket) => {
  socket.on("join", (roomid) => {
    if (roomCounts[roomid] === undefined) {
      roomCounts[roomid] = 1;
    } else if (roomCounts[roomid] < maxClientsPerRoom) {
      roomCounts[roomid]++;
    } else {
      socket.emit("room-full", roomid);
      console.log("room full" + roomCounts[roomid]);
      return;
    }
    socket.join(roomid);
    console.log(
      "user joined in a room : " + roomid + " count:" + roomCounts[roomid]
    );

    socket.on("disconnect", () => {
      roomCounts[roomid]--;
      console.log("disconnect, count:" + roomcounts[roomid]);
    });
  });

  socket.on("rtc-message", (data) => {
    var room = JSON.parse(data).roomid;
    socket.broadcast.to(room).emit("rtc-message", data);
  });
});
