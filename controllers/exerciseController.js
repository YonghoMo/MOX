const Exercise = require('../models/exerciseModel');

// 모든 운동 종목 조회
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({});  // 전체 운동 조회
    
    // 서버에서 데이터가 제대로 불러와졌는지 확인
    console.log("운동 종목 데이터: ", exercises);

    res.json(exercises);        // 조회한 데이터를 클라이언트로 응답
  } catch (error) {
    console.error("운동 종목 조회 중 오류: ", error);
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
        // 데이터베이스에 운동 종목 저장
        const newExercise = new Exercise({ name, category, measurementTypes });
        await newExercise.save();

        return res.status(201).json({
            success: true,
            message: "운동 종목이 성공적으로 추가되었습니다."
        });
    } catch (error) {
        console.error("운동 종목 추가 중 서버 오류 발생:", error);
        return res.status(500).json({
            success: false,
            message: "서버에서 운동 종목을 추가하는 중 오류가 발생했습니다."
        });
    }
};

// 여러 운동 종목에 대한 정보를 가져오는 컨트롤러 함수
exports.getMultipleExercises = async (req, res) => {
  const { exerciseIds } = req.body;  // 요청으로부터 운동 ID 배열을 가져옴

  try {
      // MongoDB에서 해당 운동 ID들에 대한 정보 조회
      const exercises = await Exercise.find({ '_id': { $in: exerciseIds } });
      res.status(200).json(exercises);
  } catch (error) {
      console.error('운동 종목 조회 중 오류 발생:', error);
      res.status(500).json({ message: '운동 종목 조회 중 오류 발생' });
  }
};