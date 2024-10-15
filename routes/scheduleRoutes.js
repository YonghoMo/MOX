const express = require('express');
const { createSchedule, readSchedule, updateSchedule, deleteSchedule, readSchedulesByUser } = require('../controllers/scheduleController');
const router = express.Router();

// 일정 추가 _id는 스키마에서 자동 생성)
router.post('/', createSchedule);

// 일정 조회 (_id로 조회)
router.get('/:_id', readSchedule);

// 일정 수정 (_id로 수정)
router.put('/:_id', updateSchedule);

// 일정 삭제 (_id로 삭제)
router.delete('/:_id', deleteSchedule);

// 특정 사용자의 모든 일정 조회
router.get('/user/:userId', readSchedulesByUser);

module.exports = router;