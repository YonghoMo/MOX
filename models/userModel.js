const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },  // 유니크한 유저네임
    password: { type: String, required: true },  // 비밀번호
});

module.exports = mongoose.model('User', UserSchema);