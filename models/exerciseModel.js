const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    exerciseId: { 
        type: String, 
        default: () => new mongoose.Types.ObjectId().toString(),  // 고유한 운동 ID 자동 생성
        unique: true 
    },
    name: { 
        type: String, 
        required: true 
    },  // 운동 이름
    category: { 
        type: String, 
        required: true, 
        enum: ['웨이트', '유산소', '맨몸운동'] 
    },  // 운동 카테고리
    exerciseType: {
        type: { 
            type: String, 
            required: true, 
            enum: ['무게/횟수', '시간', '횟수'] 
        },  // 운동량 타입 종류
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
    }
});

module.exports = mongoose.model('Exercise', exerciseSchema);