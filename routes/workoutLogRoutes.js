const express = require('express');
const router = express.Router();
const workoutLogController = require('../controllers/workoutLogController');

// 운동 기록 생성 (POST)
router.post('/saveWorkoutLog', workoutLogController.saveWorkoutLog);

// 특정 사용자의 운동 기록 조회 (GET)
router.get('/workout-logs/user/:userId', workoutLogController.getWorkoutLogsByUser);

// 특정 이벤트의 운동 기록 조회 (GET)
router.get('/event/:eventId', workoutLogController.getWorkoutLogByEvent);

// 특정 이벤트의 운동 기록 삭제 (DELETE)
router.delete('/event/:eventId', workoutLogController.deleteWorkoutLogByEvent);

// 운동 종목 별 칼로리 계산 경로
router.get('/calories', workoutLogController.getWeeklyCalories);

module.exports = router;
