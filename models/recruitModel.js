const mongoose = require('mongoose');

const recruitSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // authorId 필드 확인
    authorUsername: { type: String, required: true },
    authorNickname: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Recruit = mongoose.model('Recruit', recruitSchema);
module.exports = Recruit;
