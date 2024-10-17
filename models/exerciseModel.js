const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    measurementTypes: {
        type: [String],  // 배열로 저장
        required: true
    }
});

module.exports = mongoose.model('Exercise', exerciseSchema);
