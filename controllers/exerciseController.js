const Exercise = require('../models/exerciseModel');

// 전체 운동 종목 목록 조회
exports.getExercises = async (req, res) => {
    try {
        // 저장된 모든 운동 종목 조회
        const exercises = await Exercise.find();
        res.json(exercises);
    } catch (err) {
        console.error('운동 종목 조회 실패:', err.message);
        res.status(500).json({ error: '운동 종목 조회에 실패했습니다.' });
    }
};

// 개별 운동 종목 조회 (exerciseId로 조회)
exports.getExerciseById = async (req, res) => {
    try {
        const { exerciseId } = req.params;  // URL에서 exerciseId 가져오기
        const exercise = await Exercise.findOne({ exerciseId });
        
        if (!exercise) {
            return res.status(404).json({ error: '운동 종목을 찾을 수 없습니다.' });
        }
        
        res.json(exercise);
    } catch (err) {
        console.error('운동 종목 개별 조회 실패:', err.message);
        res.status(500).json({ error: '운동 종목 조회에 실패했습니다.' });
    }
};