// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { handleSocketConnection } = require('./controllers/socketController');  // Socket.IO 로직 불러오기
const connectDB = require('./config/db');
require('dotenv').config();  // .env 파일에서 환경 변수 로드
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const session = require('express-session');  // express-session 모듈 불러오기
const bcrypt = require('bcrypt');

// Express 앱 생성
const app = express();

// MongoDB Atlas 연결
connectDB();


// 세션 설정
app.use(session({
    secret: process.env.SECRET_KEY,  // 세션을 암호화하는 키
    resave: false,  // 세션이 변경되지 않아도 항상 저장할지 여부
    saveUninitialized: true  // 초기화되지 않은 세션을 저장할지 여부
}));

// JSON 파싱 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 로그인 페이지에 필요한 정적 파일들을 로그인 여부와 상관없이 제공
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

// 유저 경로 라우트
app.use('/api/users', userRoutes);

// 회원가입 페이지 제공 (GET 요청)
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sign_up.html'));
});

// 로그인 페이지 제공
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 로그인 여부 확인 미들웨어
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();  // 로그인되어 있으면 다음 미들웨어로 진행
    } else {
        res.redirect('/login');  // 로그인 안 된 경우 로그인 페이지로 리디렉션
    }
}

// 로그인 후에만 접근 가능한 정적 파일들
app.use('/public', isAuthenticated, express.static(path.join(__dirname, 'public')));

// 메인 페이지 경로 (인증 필요)
app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 일정 경로 라우트
app.use('/api/schedules', scheduleRoutes);

// HTTP 서버 생성
const server = http.createServer(app);

// Socket.IO 서버 생성, CORS 설정
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

// Socket.IO 연결 처리 (socketController.js의 handleSocketConnection 호출)
handleSocketConnection(io);

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});