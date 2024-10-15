// models/eventModel.js
const mongoose = require('mongoose');

// 댓글 스키마 정의
const commentSchema = new mongoose.Schema({
    userId: {
        type: String, // 사용자의 ID
        required: true,
    },
    nickname: { // 닉네임 필드 추가
        type: String,
        required: true,
    },
    text: {
        type: String, // 댓글 내용
        required: true,
    },
    date: {
        type: Date, // 댓글 작성 시간
        default: Date.now,
    },
});

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    exercises: [{ type: String }], // 운동 종목 목록
    userId: { type: String, required: true },
    comments: [commentSchema], // 댓글 목록
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
