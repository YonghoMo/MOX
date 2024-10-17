const Exercise = require('../models/exerciseModel');

// 모든 운동 종목 조회
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({});
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: '운동 종목을 불러오는 중 오류 발생', error });
  }
};

// 특정 운동 종목 조회
exports.getExerciseById = async (req, res) => {
  const { id } = req.params;
  try {
    const exercise = await Exercise.findById(id);
    if (!exercise) {
      return res.status(404).json({ message: '해당 운동 종목을 찾을 수 없습니다' });
    }
    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ message: '운동 종목을 불러오는 중 오류 발생', error });
  }
};

exports.addExercise = async (req, res) => {
    const { name, category, measurementTypes } = req.body;

    // 필수 필드 확인
    if (!name || !category || !measurementTypes || !Array.isArray(measurementTypes)) {
        return res.status(400).json({
            success: false,
            message: "모든 필드(name, category, measurementTypes)가 필요하며, measurementTypes는 배열이어야 합니다."
        });
    }

    try {
        const newExercise = new Exercise({ name, category, measurementTypes });
        await newExercise.save();

        return res.status(201).json({
            success: true,
            message: "운동 종목이 성공적으로 추가되었습니다."
        });
    } catch (error) {
        console.error("운동 종목 추가 중 오류:", error);
        alert("exerciseController.js 500 오류!");
        return res.status(500).json({
            success: false,
            message: "서버에서 운동 종목을 추가하는 중 오류가 발생했습니다."
        });
    }
};