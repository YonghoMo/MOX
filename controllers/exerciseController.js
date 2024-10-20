const Exercise = require('../models/exerciseModel');

// 모든 운동 종목 조회
exports.getAllExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find(); // 모든 운동 종목 조회
        console.log('전체 운동 종목 조회 결과:', exercises);  // 조회된 데이터를 콘솔에 출력
        res.status(200).json(exercises);
    } catch (error) {
        res.status(500).json({ message: '전체 운동 종목 조회 중 오류가 발생했습니다.', error });
    }
};

// 특정 ID의 운동 종목 조회
exports.getExerciseById = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id); // findById 사용
        if (!exercise) {
            console.log('운동 종목을 찾을 수 없습니다. ID:', req.params.id);  // 조회되지 않은 경우 콘솔 출력
            return res.status(404).json({ message: '운동 종목을 찾을 수 없습니다.' });
        }
        console.log('운동 종목 조회 결과:', exercise);  // 조회된 데이터를 콘솔에 출력
        res.status(200).json(exercise);
    } catch (error) {
        console.error('운동 종목 조회 중 오류:', error);  // 에러 발생 시 콘솔에 출력
        res.status(500).json({ message: '운동 종목 조회 중 오류가 발생했습니다.', error });
    }
};