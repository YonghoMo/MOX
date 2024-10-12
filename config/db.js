const mongoose = require('mongoose');
require('dotenv').config(); // .env 파일을 사용하는 경우에 필요합니다.

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection failed', err);
        process.exit(1);
    }
};

module.exports = connectDB;