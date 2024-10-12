const { MongoClient } = require('mongodb');
require('dotenv').config(); // .env 파일에서 환경 변수 불러오기

// MongoDB URI 설정
const uri = process.env.MONGODB_URI;

// MongoClient 객체 생성
const client = new MongoClient(uri);

// MongoDB 연결 및 데이터베이스 반환 함수
async function connectToDB() {
    try {
        await client.connect();
        console.log('MongoDB에 성공적으로 연결되었습니다.');
        return client.db('운동일정'); // 데이터베이스 이름
    } catch (error) {
        console.error('MongoDB 연결 오류:', error);
        throw error;
    }
}

// 일정 추가 함수
async function addEvent(newEvent) {
    const db = await connectToDB();
    const collection = db.collection('일정');
    await collection.insertOne(newEvent);
    console.log('새 일정이 추가되었습니다.');
}

// 일정 조회 함수
async function getEvents() {
    const db = await connectToDB();
    const collection = db.collection('일정');
    const events = await collection.find({}).toArray();
    return events;
}

// MongoDB 작업을 외부로 내보냄
module.exports = { addEvent, getEvents };