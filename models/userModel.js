const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true,
        unique: true  // 닉네임 중복 방지
    },
    height: { type: Number, required: false },
    weight: { type: Number, required: false },
    isOnline: { type: Boolean, default: false },  // 접속 여부
});

module.exports = mongoose.model('User', userSchema);
