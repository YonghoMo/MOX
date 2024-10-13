const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    requestFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Friend = mongoose.model('Friend', friendSchema);
module.exports = Friend;