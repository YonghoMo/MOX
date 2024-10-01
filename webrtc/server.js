const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 정적 파일 제공 (public 폴더에 있는 파일들을 제공)
app.use(express.static(path.join(__dirname, 'public')));

// Socket.IO 연결 처리
io.on('connection', (socket) => {
    console.log('사용자가 연결되었습니다: ', socket.id);

    // 방 만들기, 참여하기 등
    socket.on('createRoom', (room) => {
        console.log(`${socket.id}가 방을 만들었습니다: ${room}`);
        socket.join(room);
        socket.emit('created', room);
    });

    socket.on('joinRoom', (room) => {
        console.log(`${socket.id}가 방에 참여했습니다: ${room}`);
        socket.join(room);
        socket.emit('joined', room);
    });

    socket.on('signal', (data) => {
        const { room, signal } = data;
        socket.to(room).emit('signal', { signal, from: socket.id });
    });

    socket.on('leaveRoom', (room) => {
        console.log(`${socket.id}가 방을 나갔습니다: ${room}`);
        socket.leave(room);
    });

    socket.on('disconnect', () => {
        console.log('사용자가 연결을 끊었습니다: ', socket.id);
    });
});

// 서버 시작
server.listen(3000, () => {
    console.log('서버가 3000 포트에서 실행 중입니다');
});
