const express = require('express');
const { createUser, getUser } = require('../controllers/userController');
const router = express.Router();

// 회원가입 경로
router.post('/register', createUser);

// 유저 조회 경로
router.get('/:id', getUser);

module.exports = router;