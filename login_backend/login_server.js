const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// MySQL 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'userDB'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 회원가입 처리 엔드포인트
app.post('/signup', (req, res) => {
    const { username, password, email, confirmPassword } = req.body;

    // 비밀번호 확인
    if (password !== confirmPassword) {
        return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 비밀번호 암호화
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;

        // 사용자 정보 저장
        const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        db.query(query, [username, hash, email], (err, result) => {
            if (err) throw err;
            res.status(201).json({ message: '회원가입 완료' });
        });
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
