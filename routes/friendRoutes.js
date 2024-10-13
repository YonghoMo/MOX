const express = require('express');
const friendController = require('../controllers/friendController');

const router = express.Router();

// 친구 요청 관련 경로
router.post('/request', friendController.sendFriendRequest);  // 친구 요청 보내기
router.get('/requests', friendController.getFriendRequests);  // 친구 요청 목록 조회
router.get('/', friendController.getFriends);  // 친구 목록 조회 (이 부분 중요)
router.post('/accept', friendController.acceptFriendRequest);  // 친구 요청 수락
router.delete('/:friendId', friendController.removeFriend);    // 친구 삭제

module.exports = router;
