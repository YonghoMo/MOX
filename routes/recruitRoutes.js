const express = require('express');
const router = express.Router();
const recruitController = require('../controllers/recruitController');

// 친구 모집 글 작성 라우트
router.post('/recruit', recruitController.createRecruit);

// 모집 글 목록 조회 라우트
router.get('/recruits', recruitController.getRecruits);

// 친구 모집 글 삭제 라우트
router.delete('/recruit/:id', recruitController.deleteRecruit);  // :id로 recruitId를 가져올 수 있어야 함

module.exports = router;
