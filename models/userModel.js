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
    }
});

module.exports = mongoose.model('User', userSchema);
