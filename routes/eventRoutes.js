const express = require('express');
const router = express.Router();
const { createEvent, getEvents, deleteEvent } = require('../controllers/eventController');

// 사용자별 일정 조회
router.get('/', getEvents); // /api/events로 GET 요청이 들어올 경우 getEvents 실행

// 일정 등록
router.post('/', createEvent);

// 일정 삭제
router.delete('/:eventId', deleteEvent);

module.exports = router;