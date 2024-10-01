const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const helmet = require('helmet'); // Helmet 패키지 불러오기

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// helmet을 사용하여 기본 보안 헤더 적용
app.use(helmet());

// Content-Security-Policy 설정
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],  // 인라인 스크립트 및 CDN 스크립트 허용
            scriptSrcElem: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"], // 스크립트 요소 허용
            scriptSrcAttr: ["'self'", "'unsafe-inline'"],  // 이벤트 핸들러 허용
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"], // 스타일 허용
            styleSrcElem: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"], // 스타일 요소 허용
            imgSrc: ["'self'", "data:"], // 이미지 허용
            connectSrc: ["'self'"], // Ajax 연결 설정
            fontSrc: ["'self'", "https://cdn.jsdelivr.net"], // 폰트 허용
            frameAncestors: ["'self'"], // 프레임 허용 설정
        },
    })
);

// 정적 파일 제공
app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('join', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);

        const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;

        if (roomSize === 1) {
            socket.emit('waiting', 'Waiting for another user to join...');
        } else if (roomSize === 2) {
            io.to(room).emit('ready', 'Both users joined. Ready for the call.');
        } else {
            socket.emit('full', 'Room is full.');
        }
    });

    socket.on('signal', (data) => {
        io.to(data.room).emit('signal', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
