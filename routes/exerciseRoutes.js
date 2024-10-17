const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

// 모든 운동 종목 조회
router.get('/', exerciseController.getAllExercises);

// 특정 운동 종목 조회
router.get('/:id', exerciseController.getExerciseById);

// 운동 종목 추가 경로
router.post('/', exerciseController.addExercise);

module.exports = router;