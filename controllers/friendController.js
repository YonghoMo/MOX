const Friend = require('../models/friendModel');

// 친구 요청 보내기
exports.sendFriendRequest = async (req, res) => {
    const { friendName } = req.body;

    // 친구 요청 로직 구현
    try {
        // DB에 친구 요청 저장
        res.status(200).json({ success: true, message: '친구 요청이 성공적으로 전송되었습니다.' });
    } catch (error) {
        console.error('친구 요청 전송 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 받은 친구 요청 목록 조회
exports.getFriendRequests = async (req, res) => {
    try {
        // DB에서 받은 친구 요청 목록 가져오기
        const requests = await Friend.find({ requestTo: req.user.id });
        res.status(200).json({ requests });
    } catch (error) {
        console.error('친구 요청 목록 조회 중 오류 발생:', error);
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
