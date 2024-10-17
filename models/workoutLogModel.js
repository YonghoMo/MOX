const mongoose = require('mongoose');

// WorkoutLog 스키마
const workoutLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // 사용자 참조
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',  // Event 참조 (이 운동 기록이 속한 이벤트)
        required: true
    },
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',  // Exercise 참조 (운동 종목)
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    // 세트별 운동 정보
    sets: [
        {
            setNumber: { type: Number, required: true },  // 세트 번호
            measureTypes: { type: String, required: true }, // 운동량 타입 (예: '웨이트')
            value: { type: String, required: true } // 운동량 값 (예: '60kg, 10회')
        }
    ]
});

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);

module.exports = WorkoutLog;