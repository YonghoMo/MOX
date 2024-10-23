const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    // 세트별 운동 정보
    workoutLogs: [
        {
            exerciseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Exercise',  // Exercise 참조 (운동 종목)
                required: true
            },
            sets: [
                {
                    setNumber: { type: Number, required: true },
                    weight: { type: Number },  // 무게 (웨이트용)
                    reps: { type: Number },    // 횟수 (웨이트 및 맨몸운동용)
                    time: { type: String },    // 시간 (유산소용)
                    isCompleted: { type: Boolean, default: false }  // 완료 여부
                }
            ]
        }
    ],
    date: {
        type: Date,
        defaultL: Date.now
    }
});

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);