const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

// 모든 운동 종목 조회 라우터
router.get('/exercises', (req, res) => {
    console.log('전체 운동 종목 조회 요청을 받았습니다.');
    exerciseController.getAllExercises(req, res);
});

// 특정 ID의 운동 종목 조회 라우터
router.get('/exercises/:id', (req, res) => {
    console.log(`ID: ${req.params.id}의 운동 종목 조회 요청을 받았습니다.`);
    exerciseController.getExerciseById(req, res);
});

module.exports = router;