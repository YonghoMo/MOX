// controllers/commentController.js
const Event = require('../models/eventModel');
const User = require('../models/userModel');

// 댓글 저장
exports.saveComment = async (req, res) => {
    const { eventId } = req.params;
    const { userId, comment } = req.body;

    try {
        const user = await User.findById(userId); // 사용자 ID로 닉네임 조회
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // 댓글 추가
        event.comments.push({ userId, nickname: user.nickname, text: comment });
        await event.save();
        res.json({ success: true, message: 'Comment saved' });
    } catch (error) {
        console.error('Error saving comment:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// 댓글 불러오기
exports.getComments = async (req, res) => {
    const { eventId } = req.params;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.json({ success: true, comments: event.comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
