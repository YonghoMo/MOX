// controllers/eventController.js
const Event = require('../models/eventModel');
const Exercise = require('../models/exerciseModel');
const Friend = require('../models/friendModel'); // 친구 관계 모델 불러오기
const moment = require('moment');  // moment.js를 사용하여 날짜 처리를 쉽게 처리


// 사용자별 일정 조회
exports.getEvents = async (req, res) => {
    const { userId } = req.query;

    try {
        console.log("전달된 userId:", userId);

        // 사용자 본인의 일정 조회
        const userEvents = await Event.find({ userId });
        console.log("사용자 일정:", userEvents);

        // 친구 관계 조회
        const friends = await Friend.find({
            status: 'accepted',
            $or: [{ requestFrom: userId }, { requestTo: userId }]
        });

        const friendIds = friends.map(friend =>
            friend.requestFrom.toString() === userId ? friend.requestTo : friend.requestFrom
        );
        console.log("친구 ID 목록:", friendIds);

        // 친구 일정 조회
        const friendEvents = await Event.find({ userId: { $in: friendIds } });
        console.log("친구 일정:", friendEvents);

        // 본인 일정과 친구 일정 병합
        const allEvents = [
            ...userEvents.map(event => ({ ...event.toObject(), isFriendEvent: false })),
            ...friendEvents.map(event => ({ ...event.toObject(), isFriendEvent: true }))
        ];

        console.log("병합된 전체 일정:", allEvents);

        res.status(200).json({ success: true, events: allEvents });
    } catch (error) {
        console.error("일정 불러오기 오류:", error);
        res.status(500).json({ success: false, message: '일정을 불러오지 못했습니다.' });
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

//임시 일정 저장 함수
exports.createEventsBulk = async (req, res) => {
    const { events } = req.body;

    try {
        const savedEvents = [];
        for (const eventData of events) {
            const newEvent = new Event(eventData);
            const savedEvent = await newEvent.save();
            savedEvents.push(savedEvent);
        }

        res.status(201).json({ success: true, message: '일정들이 저장되었습니다.', events: savedEvents });
    } catch (error) {
        console.error("일정 저장 중 오류:", error);
        res.status(500).json({ success: false, message: '일정을 저장하는 데 실패했습니다.' });
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