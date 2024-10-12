const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { addEvent, getEvents } = require('./mongoDB'); // MongoDB 관련 함수 가져오기

let round = 0;  // 라운드 번호 관리
let restTime = 30;  // 기본 쉬는 시간
let turnCount = {};  // 방별로 턴 횟수 관리

// Express 앱 생성
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

// 정적 파일 제공 (HTML 파일 등)
app.use(express.static(path.join(__dirname, 'public')));

// 기본 경로 설정 (index.html 제공)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

                // 클라이언트에게 방을 나갔다는 알림을 보내고 초기화
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

        if (!turnCount[roomName]) {
            turnCount[roomName] = 0;
        }

        if (room) {
            const otherClient = room.find(id => id !== socket.id);
            if (otherClient) {
                io.to(otherClient).emit('your_turn');  // 상대방에게 턴 전달
            }

            turnCount[roomName]++;  // 턴 넘길 때마다 카운트 증가

            // 두 사람의 턴이 각각 한 번씩 끝나면 라운드 종료
            if (turnCount[roomName] >= 2) {
                round++;
                turnCount[roomName] = 0;  // 턴 카운트 초기화
                io.to(roomName).emit('round_end', { round, restTime });  // 라운드 종료 및 쉬는 시간 알림
            }
        }
    });

    // 쉬는 시간 조정 이벤트
    socket.on('adjust_rest_time', ({ roomName, adjustment }) => {
        restTime += adjustment;
        if (restTime < 10) restTime = 10;  // 최소 10초
        io.to(roomName).emit('update_rest_time', restTime);  // 쉬는 시간 업데이트
    });

    // 라운드 시작 이벤트
    socket.on('start_next_round', (roomName) => {
        io.to(roomName).emit('your_turn');  // 다음 라운드 턴 시작
    });
});

// 서버 실행
server.listen(3000, () => {
    console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
});
