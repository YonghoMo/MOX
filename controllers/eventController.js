// controllers/eventController.js
const Event = require('../models/eventModel');
const Exercise = require('../models/exerciseModel');
const moment = require('moment');  // moment.js를 사용하여 날짜 처리를 쉽게 처리


// 사용자별 일정 조회
exports.getEvents = async (req, res) => {
    const { userId } = req.query;

    try {
        const events = await Event.find({ userId });
        if (!events || events.length === 0) {
            return res.status(200).json({ success: true, events: [] }); // 빈 배열 반환
        }
        res.status(200).json({ success: true, events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 일정 등록
exports.createEvent = async (req, res) => {
    const { title, date, startTime, endTime, exercises, userId } = req.body;

    try {
        const newEvent = new Event({
            title,
            date,
            startTime,
            endTime,
            exercises,
            userId
        });

        await newEvent.save();
        res.status(201).json({ success: true, message: '일정이 등록되었습니다.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 일정 삭제 함수
exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findByIdAndDelete(eventId);

        if (!event) {
            return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
        }

        res.status(200).json({ message: '일정이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '일정 삭제 중 오류가 발생했습니다.' });
    }
};

exports.getEventExercises = async (req, res) => {
    try {
        const eventId = req.params.eventId;

        // populate를 사용하여 exercises 필드에 운동 종목의 상세 정보를 채움
        const event = await Event.findById(eventId).populate('exercises');

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.json({ success: true, exercises: event.exercises });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error retrieving event exercises' });
    }
};

// 오늘의 일정 가져오기 API
exports.getTodayEvents = async (req, res) => {
    const userId = req.session.user._id;

    // 오늘의 시작 시간과 끝 시간
    const todayStart = moment().startOf('day').format('YYYY-MM-DD');
    const todayEnd = moment().endOf('day').format('YYYY-MM-DD');

    try {
        // 문자열 형식으로 저장된 date 필드를 비교
        const events = await Event.find({
            userId,
            date: { $gte: todayStart, $lte: todayEnd }
        });

        res.status(200).json({ success: true, events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};