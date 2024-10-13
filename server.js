// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { handleSocketConnection } = require('./controllers/socketController');  // Socket.IO 로직 불러오기
const userController = require('./controllers/userController');  // userController 불러오기
const connectDB = require('./config/db');
require('dotenv').config();  // .env 파일에서 환경 변수 로드
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const recruitRoutes = require('./routes/recruitRoutes');
const friendRoutes = require('./routes/friendRoutes');
const User = require('./models/userModel');
const session = require('express-session');  // express-session 모듈 불러오기
const bcrypt = require('bcrypt');
const cors = require('cors');

// Express 앱 생성
const app = express();

// HTTP 서버 생성
const server = http.createServer(app);

// Socket.IO 서버 생성, CORS 설정
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

// MongoDB Atlas 연결
connectDB();

// 세션 설정
app.use(session({
    secret: process.env.SECRET_KEY,  // 세션을 암호화하는 키
    resave: false,  // 세션이 변경되지 않아도 항상 저장할지 여부
    saveUninitialized: true,  // 초기화되지 않은 세션을 저장할지 여부
    cookie: {
        secure: false,  // HTTPS에서만 동작하도록 설정할지 여부 (HTTP에서는 false로 설정)
        httpOnly: true,  // 클라이언트 측에서 쿠키에 접근하지 못하도록 설정
        maxAge: 3600000  // 세션 유지 시간 (1시간)
    }
}));

app.use(cors({
    origin: 'http://localhost:5000',  // 클라이언트 도메인
    credentials: true  // 쿠키 허용
}));

// JSON 파싱 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO 연결 처리 (socketController.js의 handleSocketConnection 호출)
handleSocketConnection(io);

// 로그인 여부 확인 미들웨어
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();  // 로그인되어 있으면 다음 미들웨어로 진행
    } else {
        res.redirect('/login');  // 로그인 안 된 경우 로그인 페이지로 리디렉션
    }
}

// 로그아웃 라우트
app.get('/logout', (req, res) => {
    // 세션을 파기하여 로그아웃 처리
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('로그아웃 중 문제가 발생했습니다.');
        }
        // 로그아웃 후 로그인 페이지로 리디렉션
        res.redirect('/login');
    });
});

// 로그인 페이지에 필요한 정적 파일들을 로그인 여부와 상관없이 제공
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));

// 유저 경로 라우트
app.use('/api/users', userRoutes);

// 친구 경로 라우트
app.use('/api/friends', friendRoutes);
app.use('/api/recruits', recruitRoutes);

// 로그인 페이지 제공
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 회원가입 페이지 제공 (GET 요청)
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sign_up.html'));
});

// 모든 정적 파일 제공 (로그인 후에만 접근 가능)
app.use(isAuthenticated, express.static(path.join(__dirname, 'public')));

// 메인 페이지 경로 (인증 필요)
app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/users/me', (req, res) => {
    if (req.session.user) {
        return res.json({ userId: req.session.user._id }); // 세션에서 사용자 ID 반환
    } else {
        return res.status(401).json({ message: '로그인이 필요합니다.' }); // 로그인이 안 된 경우
    }
});


// 일정 경로 라우트
app.use('/api/schedules', scheduleRoutes);

// 서버 실행
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {  // 수정된 부분
    console.log(`Server running on http://localhost:${PORT}`);
});