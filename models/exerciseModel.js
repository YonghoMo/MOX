const mongoose = require('mongoose');

// 운동 종목 스키마 정의
const exerciseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },  // 운동 이름
    category: { 
        type: String, 
        required: true, 
        enum: ['웨이트', '유산소', '맨몸운동'] 
    },  // 운동 카테고리
    weight: { 
        type: Number, 
        default: null 
    },  // 무게 (웨이트용)
    repetitions: { 
        type: Number, 
        default: null 
    },  // 횟수 (웨이트/맨몸운동용)
    time: { 
        type: Number, 
        default: null 
    }  // 시간 (유산소용)
}, {
    timestamps: true,  // 생성 및 수정 시간 자동 기록
});

module.exports = mongoose.model('Exercise', exerciseSchema);