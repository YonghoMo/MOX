const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const { getOnlineFriends } = require('../controllers/friendController');

// 친구 요청 관련 경로
router.post('/request', friendController.sendFriendRequest);  // 친구 요청 보내기
router.get('/requests', friendController.getFriendRequests);  // 친구 요청 목록 조회
router.get('/', friendController.getFriends);  // 친구 목록 조회 (이 부분 중요)
router.post('/accept/:requestId', friendController.acceptFriendRequest);  // 친구 요청 수락
router.post('/reject/:requestId', friendController.rejectFriendRequest);  // 친구 요청 거절
router.delete('/:friendId', friendController.removeFriend);    // 친구 삭제
// 접속 중인 친구 목록 API
router.get('/online', getOnlineFriends);

module.exports = router;
