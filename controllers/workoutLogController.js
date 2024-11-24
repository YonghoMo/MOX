const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const WorkoutLog = require('../models/workoutLogModel');
const User = require('../models/userModel');
const Event = require('../models/eventModel');

// 운동 기록 생성
exports.saveWorkoutLog = async (req, res) => {
    console.log("서버로 받은 workoutLogs 데이터: ", JSON.stringify(req.body.workoutLogs, null, 2)); // 추가된 로그

    try {
        const { userId, eventId, workoutLogs } = req.body;

        // 관련 Event 조회
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: '해당 일정(Event)을 찾을 수 없습니다.' });
        }

        // Event의 날짜를 가져옴
        const eventDate = new Date(event.date); // Event의 date 필드 사용
        console.log('Event 날짜:', eventDate);

        const logs = workoutLogs.map(log => ({
            exerciseId: log.exerciseId,
            sets: log.sets.map(set => ({
                setNumber: set.setNumber,
                weight: set.weight,  // weight 값 확인
                reps: set.reps,
                time: set.time,
                isCompleted: set.isCompleted,
            }))
        }));

        // workoutLog에 저장
        const newWorkoutLog = new WorkoutLog({
            userId,
            eventId,
            workoutLogs: logs,
            date: eventDate // Event의 날짜 사용
        });

        // 데이터베이스에 저장
        await newWorkoutLog.save();

        // 디버깅용 메세지
        console.log('Event 모델:', Event);

        res.status(201).json({ success: true, message: '운동 기록이 저장되었습니다.' });
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

// 운동 기록 조회 (이벤트별로)
exports.getWorkoutLogByEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
        const workoutLog = await WorkoutLog.findOne({ eventId }).populate('workoutLogs.exerciseId', 'name category');
        if (!workoutLog) {
            return res.status(404).json({ message: '운동 기록을 찾을 수 없습니다.' });
        }
        res.status(200).json(workoutLog);
    } catch (error) {
        console.error('운동 기록 조회 중 오류 발생:', error);
        res.status(500).json({ message: '운동 기록 조회 중 오류가 발생했습니다.' });
    }
};

// 운동 기록 삭제 (특정 이벤트에 대한 운동 기록 삭제)
exports.deleteWorkoutLogByEvent = async (req, res) => {
    const { eventId } = req.params;
    console.log(`삭제 요청 받은 eventId: ${eventId}`);
    try {
        const deletedLog = await WorkoutLog.findOneAndDelete({ eventId });
        if (!deletedLog) {
            return res.status(404).json({ message: '운동 기록을 찾을 수 없습니다.' });
        }
        res.status(200).json({ success: true, message: '운동 기록이 삭제되었습니다.' });
    } catch (error) {
        console.error('운동 기록 삭제 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '운동 기록 삭제 중 오류가 발생했습니다.' });
    }
};


// 운동 종목 별 칼로리 계산
exports.getWeeklyCalories = async (req, res) => {
    try {
        const userId = req.session.user?._id;
        if (!userId) {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }

        const user = await User.findById(userId);
        if (!user || !user.weight) {
            return res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
        }

        const weight = user.weight;

        // 최근 1주일 데이터 필터링
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const workoutLogs = await WorkoutLog.find({
            userId,
            date: { $gte: sevenDaysAgo },
        }).populate('workoutLogs.exerciseId');

        // 디버깅: 모든 로그 출력
        console.log('운동 로그 데이터:', workoutLogs);

        // 날짜별 데이터를 저장할 객체 초기화
        const calorieDataByDate = {};
        const days = Array(7).fill(null).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
            calorieDataByDate[formattedDate] = { 웨이트: 0, 유산소: 0, 맨몸운동: 0 };
            return formattedDate;
        });

        // 날짜 별 칼로리 데이터 계산
        workoutLogs.forEach((log) => {
            const logDate = new Date(log.date).toISOString().split('T')[0]; // 로그 날짜
            
            if (!calorieDataByDate[logDate]) return;

            log.workoutLogs.forEach((workout) => {
                const exercise = workout.exerciseId;
                if (!exercise) return;

                workout.sets.forEach((set) => {
                    if (exercise.category === '웨이트') {
                        calorieDataByDate[logDate]['웨이트'] += set.weight * set.reps * set.setNumber * 0.08;
                    } else if (exercise.category === '유산소') {
                        const timeInMinutes = parseFloat(set.time) || 0;
                        calorieDataByDate[logDate]['유산소'] += 10 * (1 / 60) * weight * timeInMinutes;
                    } else if (exercise.category === '맨몸운동') {
                        calorieDataByDate[logDate]['맨몸운동'] += weight * set.reps * set.setNumber * 0.05;
                    }
                });
            });
        });

        console.log('최종 계산된 날짜별 칼로리 데이터:', calorieDataByDate);

        res.status(200).json({ days, calorieDataByDate });
    } catch (error) {
        console.error('오류 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};