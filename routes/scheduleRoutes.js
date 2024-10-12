const express = require('express');
const { createSchedule, getSchedule } = require('../controllers/scheduleController');
const router = express.Router();

// 일정 추가 경로
router.post('/', createSchedule);

// 일정 조회 경로
router.get('/:id', getSchedule);

module.exports = router;