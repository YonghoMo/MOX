const WorkoutLog = require('../models/workoutLogModel');
const Exercise = require('../models/exerciseModel');

// 운동 기록 생성
exports.createWorkoutLog = async (req, res) => {
    try {
        const { userId, eventId, exerciseId, date, sets } = req.body;

        // 해당 운동 기록이 저장될 운동 종목 정보 가져오기 (운동량 타입 포함)
        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) {
            return res.status(404).json({ message: '해당 운동을 찾을 수 없습니다.' });
        }

        // 새로운 운동 기록 생성
        const newWorkoutLog = new WorkoutLog({
            userId,
            eventId,
            exerciseId,
            date,
            sets
        });

        await newWorkoutLog.save();
        return res.status(201).json({ message: '운동 기록이 성공적으로 생성되었습니다.', workoutLog: newWorkoutLog });
    } catch (error) {
        return res.status(500).json({ message: '운동 기록 생성 중 오류가 발생했습니다.', error });
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

// 운동 기록 수정
exports.updateWorkoutLog = async (req, res) => {
    try {
        const { workoutLogId } = req.params;
        const { sets } = req.body;

        // 운동 기록 업데이트
        const updatedWorkoutLog = await WorkoutLog.findByIdAndUpdate(workoutLogId, { sets }, { new: true });

        if (!updatedWorkoutLog) {
            return res.status(404).json({ message: '해당 운동 기록을 찾을 수 없습니다.' });
        }

        return res.status(200).json({ message: '운동 기록이 성공적으로 업데이트되었습니다.', workoutLog: updatedWorkoutLog });
    } catch (error) {
        return res.status(500).json({ message: '운동 기록 업데이트 중 오류가 발생했습니다.', error });
    }
};

// 운동 기록 삭제
exports.deleteWorkoutLog = async (req, res) => {
    try {
        const { workoutLogId } = req.params;

        // 운동 기록 삭제
        const deletedWorkoutLog = await WorkoutLog.findByIdAndDelete(workoutLogId);

        if (!deletedWorkoutLog) {
            return res.status(404).json({ message: '해당 운동 기록을 찾을 수 없습니다.' });
        }

        return res.status(200).json({ message: '운동 기록이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        return res.status(500).json({ message: '운동 기록 삭제 중 오류가 발생했습니다.', error });
    }
};