const mongoose = require('mongoose');

const recruitSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    authorUsername: { type: String, required: true },  // 사용자 username 저장
    authorNickname: { type: String, required: true },  // 사용자 nickname 저장
    createdAt: { type: Date, default: Date.now }
});

const Recruit = mongoose.model('Recruit', recruitSchema);
module.exports = Recruit;
