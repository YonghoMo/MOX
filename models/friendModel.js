const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    requestFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requestTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

const Friend = mongoose.model('Friend', friendSchema);
module.exports = Friend;
