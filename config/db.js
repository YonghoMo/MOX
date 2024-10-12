const mongoose = require('mongoose');

// MongoDB 연결 설정 함수
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // 옵션 제거
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // 연결 실패 시 프로세스 종료
    }
};

module.exports = connectDB;
