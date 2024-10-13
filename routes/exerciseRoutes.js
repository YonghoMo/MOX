const express = require('express');
const router = express.Router();
const { getExercises, getExerciseById } = require('../controllers/exerciseController');

// 전체 운동 종목 목록 조회 API
router.get('/list', getExercises);

// 개별 운동 종목 조회 (exerciseId로 조회)
router.get('/:exerciseId', getExerciseById);

module.exports = router;