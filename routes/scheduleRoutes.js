const express = require('express');
const { createSchedule, readSchedule, updateSchedule, deleteSchedule } = require('../controllers/scheduleController');
const router = express.Router();

// 일정 추가 (eventId는 스키마에서 자동 생성)
router.post('/', createSchedule);

// 일정 조회 (eventId로 조회)
router.get('/:eventId', readSchedule);

// 일정 수정 (eventId로 수정)
router.put('/:eventId', updateSchedule);

// 일정 삭제 (eventId로 삭제)
router.delete('/:eventId', deleteSchedule);


module.exports = router;