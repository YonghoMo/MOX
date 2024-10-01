const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// helmet을 사용하여 기본 보안 헤더 적용
app.use(helmet());

// CSP 설정
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            scriptSrc: ["'self'", "'unsafe-inline'"], // 필요한 경우, 스크립트를 허용
            styleSrc: ["'self'", "'unsafe-inline'"],  // 스타일 허용
            // 추가적인 리소스 지시자는 필요에 따라 설정
        },
    })
);

app.use(express.static('__dirname'));

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
