const express = require('express');
const router = express.Router();
const workoutLogController = require('../controllers/workoutLogController');

// 운동 기록 생성 (POST)
router.post('/workout-logs', workoutLogController.createWorkoutLog);

// 특정 사용자의 운동 기록 조회 (GET)
router.get('/workout-logs/user/:userId', workoutLogController.getWorkoutLogsByUser);

// 운동 기록 수정 (PUT)
router.put('/workout-logs/:workoutLogId', workoutLogController.updateWorkoutLog);

// 운동 기록 삭제 (DELETE)
router.delete('/workout-logs/:workoutLogId', workoutLogController.deleteWorkoutLog);

module.exports = router;