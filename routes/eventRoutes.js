const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent, getEventExercises, getTodayEvents } = require('../controllers/eventController');

// 사용자별 일정 조회
router.get('/', getEvents); // /api/events로 GET 요청이 들어올 경우 getEvents 실행

// 일정 등록
router.post('/', createEvent);

// 일정 삭제
router.delete('/:id', deleteEvent);

// 오늘의 일정 조회 경로 추가
router.get('/today', getTodayEvents);

// 선택된 운동 종목을 가져오는 API
router.get('/:eventId/exercises', getEventExercises);

module.exports = router;