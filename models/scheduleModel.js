const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    title: { type: String, required: true },  // 일정 제목
    start: { type: Date, required: true },  // 시작 날짜
    end: { type: Date },  // 종료 날짜
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // 유저 참조
});

module.exports = mongoose.model('Schedule', ScheduleSchema);