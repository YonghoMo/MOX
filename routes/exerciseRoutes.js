const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

// 모든 운동 종목 조회
router.get('/', exerciseController.getAllExercises);

// 특정 운동 종목 조회
router.get('/:id', exerciseController.getExerciseById);

// 새로운 운동 종목 추가 (제작자만 사용)
router.post('/', exerciseController.createExercise);

module.exports = router;