const WorkoutLog = require('../models/workoutLogModel');
const Exercise = require('../models/exerciseModel');

// 운동 기록 생성
exports.saveWorkoutLog = async (req, res) => {}
    const { userId, eventId, workoutLogs, date } = req.body;
    try {
        
        // workoutLog 생성
        const newworkoutLog = new WorkoutLog({
            userId,
            eventId,
            workoutLogs,
            date
        });

        // 데이터베이스에 저장
        await newworkoutLog.save();

        return res.status(201).json({ success: true, message: '운동 기록이 저장되었습니다.' });
    } catch (error) {
        console.error('운동 기록 저장 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '운동 기록 저장 중 오류가 발생했습니다.' });
    }
};

// 운동 기록 조회 (사용자별로)
exports.getWorkoutLogsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const workoutLogs = await WorkoutLog.find({ userId }).populate('exerciseId').populate('eventId');
        
        return res.status(200).json({ workoutLogs });
    } catch (error) {
        return res.status(500).json({ message: '운동 기록 조회 중 오류가 발생했습니다.', error });
    }
};