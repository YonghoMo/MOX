// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// 댓글 저장
router.post('/events/:eventId/comments', commentController.saveComment);

// 댓글 불러오기
router.get('/events/:eventId/comments', commentController.getComments);

module.exports = router;
