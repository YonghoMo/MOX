const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 회원가입 경로
router.post('/signup', userController.signup);

// 로그인 경로
router.post('/login', userController.login);

module.exports = router;
