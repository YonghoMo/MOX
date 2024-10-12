// controllers/socketController.js

// 방 목록을 저장할 객체
let rooms = {};
// 사용자가 만든 방을 저장할 객체
let userRooms = {};
// 방별로 턴 횟수를 관리하는 객체
let turnCount = {};
// 라운드 번호 및 기본 쉬는 시간 관리
let round = 0;
let restTime = 30;

// 방 목록 갱신 함수, 모든 클라이언트에게 방 목록을 전송
function updateRooms(io) {
    io.emit('room_list', rooms);
}

// Socket.IO 연결 및 이벤트 처리 함수
function handleSocketConnection(io) {
    io.on('connection', (socket) => {
        console.log('새 클라이언트가 연결되었습니다.');

        // 방 목록 요청 처리
        socket.on('get_rooms', () => {
            socket.emit('room_list', rooms);
        });

        // 방 생성 처리
        socket.on('create_room', (roomName) => {
            if (userRooms[socket.id]) {
                // 사용자가 이미 방을 만든 경우 에러 메시지 전송
                socket.emit('error_message', '이미 방을 만들었습니다.');
            } else if (rooms[roomName]) {
                // 이미 존재하는 방 이름이면 에러 메시지 전송
                socket.emit('error_message', '이미 존재하는 방입니다.');
            } else {
                // 새로운 방 생성 및 방 목록 갱신
                rooms[roomName] = [];
                userRooms[socket.id] = roomName;
                updateRooms(io);
            }
        });

        // 방 참가 처리
        socket.on('join_room', (roomName) => {
            const room = rooms[roomName];
            if (room && room.length < 2) {
                socket.join(roomName);  // 클라이언트를 해당 방에 참가시킴
                room.push(socket.id);   // 방 목록에 클라이언트 추가
                socket.emit('joined_room', roomName);

                // 방에 두 명이 있으면 첫 번째 플레이어에게 턴 시작 이벤트 전송
                if (room.length === 2) {
                    const firstPlayer = room[0];
                    io.to(firstPlayer).emit('your_turn');  // 첫 번째 플레이어에게 턴 전송
                }

                io.to(roomName).emit('player_joined', { roomName, playerCount: room.length });
                updateRooms(io);
            } else {
                socket.emit('error_message', '방이 가득 찼습니다.');
            }
        });

        // 방 나가기 처리
        socket.on('leave_room', (roomName) => {
            const room = rooms[roomName];
            if (room) {
                const index = room.indexOf(socket.id);
                if (index !== -1) {
                    socket.leave(roomName);  // 방 나가기
                    room.splice(index, 1);   // 방 목록에서 클라이언트 제거
                    io.to(roomName).emit('player_left', { roomName, playerCount: room.length });

                    if (room.length === 0) {
                        delete rooms[roomName];  // 방에 클라이언트가 없으면 방 삭제
                    }

                    socket.emit('left_room');  // 방을 나갔다는 알림 전송
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
                        room.splice(index, 1);  // 방 목록에서 클라이언트 제거
                        io.to(roomName).emit('player_left', { roomName, playerCount: room.length });

                        if (room.length === 0) {
                            delete rooms[roomName];  // 방에 클라이언트가 없으면 방 삭제
                        }
                    }
                }
            }
            updateRooms(io);  // 방 목록 갱신
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
            if (restTime < 10) restTime = 10;  // 최소 쉬는 시간 10초
            io.to(roomName).emit('update_rest_time', restTime);  // 쉬는 시간 업데이트
        });

        // 라운드 시작 이벤트
        socket.on('start_next_round', (roomName) => {
            io.to(roomName).emit('your_turn');  // 다음 라운드 턴 시작
        });
    });
}

module.exports = { handleSocketConnection };