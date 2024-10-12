// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { handleSocketConnection } = require('./controllers/socketController');  // Socket.IO 로직 불러오기
const connectDB = require('./config/db');
require('dotenv').config();  // .env 파일에서 환경 변수 로드
const userRoutes = require('./routes/userRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

// Express 앱 생성
const app = express();

// MongoDB Atlas 연결
connectDB();

// JSON 파싱 미들웨어
app.use(express.json());

// 유저 경로
app.use('/api/users', userRoutes);
// 일정 경로 
app.use('/api/schedules', scheduleRoutes);

// HTTP 서버 생성
const server = http.createServer(app);

// Socket.IO 서버 생성, CORS 설정
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

// Socket.IO 연결 처리 (socketController.js의 handleSocketConnection 호출)
handleSocketConnection(io);

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));