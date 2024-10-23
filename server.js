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
const recruitRoutes = require('./routes/recruitRoutes');
const friendRoutes = require('./routes/friendRoutes');
const eventRoutes = require('./routes/eventRoutes');
const commentRoutes = require('./routes/commentRoutes');
//const exerciseRoutes = require('./routes/exerciseRoutes'); // 추가!!!!!!!!!!!!!!!!!!!!
const workoutLogRoutes = require('./routes/workoutLogRoutes'); // 추가!!!!!!!!!!!!!!!!!
const exerciseRoutes = require('./routes/exerciseRoutes');
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
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,  // HTTPS가 아닌 경우 false로 설정
        httpOnly: true,  // 클라이언트에서 쿠키에 접근하지 못하도록 설정
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

// 정적 자원에 대해서는 캐시 유지 (1일 동안 캐시)
app.use(express.static('public', {
    maxAge: '1d',  // 1일간 캐시 유지
}));

// Socket.IO 연결 처리 (socketController.js의 handleSocketConnection 호출)
handleSocketConnection(io);

// 첫 페이지로 리디렉션
app.get('/', (req, res) => {
    res.redirect('/login.html');  // '/login.html'로 리디렉션
});

// 운동 종목 관련 라우팅 
app.use('/api/exercises', exerciseRoutes);      // 추가!!!!!!!!!!!!!!!!!!!!!!!!!
// 운동 기록 관련 라우팅                          // 추가!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.use('/api/workoutLogs', workoutLogRoutes);

// 친구 요청 목록 라우팅
app.use('/api/friends', friendRoutes);

// 유저 경로 라우트
app.use('/api/users', userRoutes);

// 친구 모집 글 라우트
app.use('/api/recruits', recruitRoutes);

// 캘린더 라우트
app.use('/api/events', eventRoutes);

// 댓글 라우트 사용
app.use('/api', commentRoutes);

// 세션에서 사용자 정보 반환
app.get('/api/users/me', (req, res) => {
    if (req.session.user) {
        // 세션에서 userId와 nickname 모두 반환
        return res.json({
            userId: req.session.user._id,
            nickname: req.session.user.nickname
        });
    } else {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
});

// 로그아웃 처리
app.get('/logout', (req, res) => {
    // 세션을 파기하여 로그아웃 처리
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('로그아웃 중 문제가 발생했습니다.');
        }
        // 로그아웃 후 로그인 페이지로 리디렉션
        res.redirect('/login.html');
    });
});

// /api/events/today 경로에만 캐시 비활성화 설정
app.use('/api/events/today', (req, res, next) => {
    res.set('Cache-Control', 'no-store');  // 해당 API에 대해 캐시 비활성화
    next();
});

// 서버 실행
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
