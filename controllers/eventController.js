// controllers/eventController.js
const Event = require('../models/eventModel');
const Exercise = require('../models/exerciseModel');

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

// 일정 삭제
exports.deleteEvent = async (req, res) => {
    const { eventId } = req.params;

    try {
        await Event.findByIdAndDelete(eventId);
        res.status(200).json({ success: true, message: '일정이 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
