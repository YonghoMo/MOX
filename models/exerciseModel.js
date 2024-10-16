const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['웨이트', '유산소', '맨몸운동'], required: true },
  metricType: { 
    type: [String],  // 배열로 타입을 저장
    required: true,
    default: function() {
      switch (this.category) {
        case '웨이트': return ['무게', '횟수'];  // 웨이트는 무게와 횟수 모두
        case '유산소': return ['시간'];
        case '맨몸운동': return ['횟수'];
        default: return ['횟수'];
      }
    }
  }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
