const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const Exercise = require('../models/exerciseModel');  // Exercise 모델 추가

// 운동 종목 가져오는 API
router.get('/', async (req, res) => {
    try {
      const exercises = await Exercise.find();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ error: '운동 종목을 불러오는 데 실패했습니다.' });
    }
});

// 특정 운동 종목 조회
router.get('/:id', exerciseController.getExerciseById);

// 운동 종목 추가
router.post('/', exerciseController.addExercise);

module.exports = router;