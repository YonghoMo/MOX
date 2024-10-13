const Friend = require('../models/friendModel');
const User = require('../models/userModel');  // User 모델 불러오기
const mongoose = require('mongoose');


exports.sendFriendRequest = async (req, res) => {
    const { friendName } = req.body;
    const userId = req.session.user ? req.session.user.authorId : null;  // 세션에서 사용자 ID 가져오기

    // 사용자 ID가 없으면 로그인 오류 반환
    if (!userId) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    console.log('현재 사용자 ID:', userId);  // 사용자 ID 로그 출력
    console.log('전달된 친구 이름:', friendName);  // friendName 로그 출력

    try {
        // friendName으로 사용자 조회 (예시로, 친구 이름으로 검색 후 ID를 얻음)
        const friendUser = await User.findById(friendName);
        if (!friendUser) {
            return res.status(404).json({ message: '친구를 찾을 수 없습니다.' });
        }

        // 새로운 친구 요청 생성
        const newFriendRequest = new Friend({
            requestFrom: userId,  // 사용자 ID를 requestFrom에 설정
            requestTo: friendUser.authorId,  // 친구의 ID
            status: 'pending'
        });

        // DB에 친구 요청 저장
        await newFriendRequest.save();

        res.status(200).json({ success: true, message: '친구 요청이 성공적으로 전송되었습니다.' });
    } catch (error) {
        console.error('친구 요청 전송 중 오류 발생:', error);  // 오류 로그 출력
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 받은 친구 요청 목록 조회
exports.getFriendRequests = async (req, res) => {
    try {
        const userId = req.session.user._id;

        // DB에서 현재 로그인한 사용자가 받은 친구 요청을 찾음
        const requests = await Friend.find({ requestTo: userId, status: 'pending' });

        if (!requests.length) {
            return res.status(404).json({ message: '받은 친구 요청이 없습니다.' });
        }

        res.status(200).json({ requests });
    } catch (error) {
        console.error('친구 요청 목록 불러오기 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 친구 요청 수락
exports.acceptFriendRequest = async (req, res) => {
    const { from } = req.body;

    try {
        // DB에서 친구 요청을 수락하는 로직 구현
        res.status(200).json({ success: true, message: '친구 요청을 수락했습니다.' });
    } catch (error) {
        console.error('친구 요청 수락 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 친구 삭제
exports.removeFriend = async (req, res) => {
    const { friendName } = req.body;

    try {
        // DB에서 친구 삭제 로직 구현
        res.status(200).json({ success: true, message: '친구가 삭제되었습니다.' });
    } catch (error) {
        console.error('친구 삭제 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 현재 친구 목록
exports.getFriends = async (req, res) => {
    try {
        const userId = req.session.user._id;  // 세션에서 사용자 ID 가져오기

        // 수락된 친구 요청 목록 가져오기 (requestFrom 또는 requestTo가 userId인 친구 관계)
        const friends = await Friend.find({
            $or: [
                { requestFrom: userId, status: 'accepted' },
                { requestTo: userId, status: 'accepted' }
            ]
        }).populate('requestFrom requestTo', 'username');  // 친구 정보를 가져오기 위해 populate 사용

        res.status(200).json({ friends });
    } catch (error) {
        console.error('친구 목록 조회 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};