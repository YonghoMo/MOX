const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    // 고유한 eventId 생성
    eventId: { type: String, default: () => new mongoose.Types.ObjectId().toString() }, 
    title: { type: String, required: true },        // 일정 제목
    date: { type: Date, required: true },           // 일정 날짜
    startTime: { type: String, required: true },    // 시작 시간 (hh:mm)
    endTime: { type: String, required: true },      // 종료 시간 (hh:mm)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }   // 유저 참조
});

module.exports = mongoose.model('Schedule', ScheduleSchema);