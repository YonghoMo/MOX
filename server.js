const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Express 앱 생성
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

// 정적 파일 제공 (HTML 파일 등)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/challenge.html');
  });

// 방 목록을 관리할 객체
let rooms = {};
let userRooms = {};  // 사용자가 만든 방을 저장

// 방 목록 갱신 함수
function updateRooms() {
    io.emit('room_list', rooms);
}

io.on('connection', (socket) => {
    console.log('새 클라이언트가 연결되었습니다.');

    // 방 목록 요청 처리
    socket.on('get_rooms', () => {
        socket.emit('room_list', rooms); 
    });

    // 방 생성
    socket.on('create_room', (roomName) => {
        if (userRooms[socket.id]) {
            socket.emit('error_message', '이미 방을 만들었습니다.');
        } else if (rooms[roomName]) {
            socket.emit('error_message', '이미 존재하는 방입니다.');
        } else {
            rooms[roomName] = [];
            userRooms[socket.id] = roomName;  // 사용자가 만든 방 저장
            updateRooms();  
        }
    });

    // 방 참가
    socket.on('join_room', (roomName) => {
        const room = rooms[roomName];
        if (room && room.length < 2) {
            socket.join(roomName);
            room.push(socket.id);
            socket.emit('joined_room', roomName);

            // 방에 두 명이 되면 첫 번째 플레이어에게 턴 시작 이벤트 전송
            if (room.length === 2) {
                const firstPlayer = room[0];
                io.to(firstPlayer).emit('your_turn');  // 첫 번째 플레이어에게 턴 시작 이벤트
            }

            io.to(roomName).emit('player_joined', { roomName, playerCount: room.length });

            updateRooms();
        } else {
            socket.emit('error_message', '방이 가득 찼습니다.');
        }
    });

    // 방에서 나가기 처리
    socket.on('leave_room', (roomName) => {
        const room = rooms[roomName];
        if (room) {
            const index = room.indexOf(socket.id);
            if (index !== -1) {
                socket.leave(roomName);
                room.splice(index, 1);

                io.to(roomName).emit('player_left', { roomName, playerCount: room.length });

                if (room.length === 0) {
                    delete rooms[roomName];
                }

                delete userRooms[socket.id];  // 사용자가 만든 방 정보 제거
                updateRooms();
                socket.emit('left_room');
            }
        }
    });

    // 클라이언트 연결 해제 처리
    socket.on('disconnect', () => {
        const roomName = userRooms[socket.id];
        if (roomName) {
            delete userRooms[socket.id];  // 사용자가 만든 방 제거
            const room = rooms[roomName];
            if (room) {
                const index = room.indexOf(socket.id);
                if (index !== -1) {
                    room.splice(index, 1);
                    io.to(roomName).emit('player_left', { roomName, playerCount: room.length });

                    if (room.length === 0) {
                        delete rooms[roomName];
                    }
                }
            }
        }
        updateRooms();
        console.log('클라이언트가 연결을 해제했습니다.');
    });

    // 턴 넘기기 처리
    socket.on('pass_turn', (roomName) => {
        const room = rooms[roomName];
        if (room) {
            const otherClient = room.find(id => id !== socket.id);
            if (otherClient) {
                io.to(otherClient).emit('your_turn');  // 상대방에게 턴 전달
            }
        }
    });
});

// 서버 실행
server.listen(3000, () => {
    console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
});
