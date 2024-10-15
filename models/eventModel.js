// models/eventModel.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    exercises: [{ type: String }], // 운동 종목 목록
    userId: { type: String, required: true }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
