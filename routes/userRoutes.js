const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 회원가입 경로
router.post('/signup', userController.signup);

// 로그인 경로
router.post('/login', userController.login);

// 인증된 사용자 정보 반환
router.get('/me', (req, res) => {
    if (req.session.user) {
        return res.json({ userId: req.session.user._id });  // 세션에 저장된 사용자 ID 반환
    } else {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
});

module.exports = router;
