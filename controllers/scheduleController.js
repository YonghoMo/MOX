const Schedule = require('../models/scheduleModel');

// 일정 추가 기능
exports.createSchedule = async (req, res) => {
    const { title, date, startTime, endTime, userId } = req.body;

    try {
        // 새 일정 생성
        const newschedule = new Schedule({
            title,
            date,
            startTime,
            endTime,
            userId
        });
        await newschedule.save();  // DB에 저장
        res.status(201).json({ message: 'Schedule created', scheduleId: newSchedule._id });
    } catch (err) {
        console.error('일정 생성 실패:', err.message);
        res.status(500).json({ error: '일정 생성에 실패했습니다.' });
    }
};

// 일정 조회 기능
exports.readSchedule = async (req, res) => {
    try {
        const { id } = req.params;  // URL에서 eventId 가져오기
        const schedule = await Schedule.findById(id);  // _id로 일정 찾기

        if (!schedule) {
            return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
        }

        res.json(schedule);
    } catch (err) {
        console.error('일정 조회 실패:', err.message);
        res.status(500).json({ error: '일정 조회에 실패했습니다.' });
    }
};

// 일정 수정 기능
exports.updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;    // _id 가져오기
        const { exerciseType, weight, repetitions, time } = req.body;

        // _id로 일정 식별
        const schedule = await Schedule.findById(id);

        if (!schedule) {
            return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
        }

        // 운동량 업데이트
        schedule.exerciseType = {
            type: exerciseType,
            weight: exerciseType === '웨이트' ? weight : undefined,
            repetitions: exerciseType !== '유산소' ? repetitions : undefined,
            time: exerciseType === '유산소' ? time : undefined
        };

        await schedule.save();
        res.status(200).json({ message: '운동량이 성공적으로 저장되었습니다.' });
    } catch (err) {
        console.error('운동량 저장 실패:', err.message);
        res.status(500).json({ error: '운동량 저장에 실패했습니다.' });
    }
};

// 일정 삭제
exports.deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;  // URL에서 _id 가져오기
        const deletedSchedule = await Schedule.findByIdAndDelete(id);

        if (!deletedSchedule) {
            return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
        }

        res.json({ message: '일정이 성공적으로 삭제되었습니다.', scheduleId: deletedSchedule._id });
    } catch (err) {
        console.error('일정 삭제 실패:', err.message);
        res.status(500).json({ error: '일정 삭제에 실패했습니다.' });
    }
};

exports.readSchedulesByUser = async (req, res) => {
    try {
        const { userId } = req.params;  // URL에서 userId 가져오기
        const schedules = await Schedule.find({ userId });  // userId로 모든 일정 조회

        if (!schedules) {
            return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
        }

        res.json(schedules);
    } catch (err) {
        console.error('일정 조회 실패:', err.message);
        res.status(500).json({ error: '일정 조회에 실패했습니다.' });
    }
};