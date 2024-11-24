const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel'); // 유저 모델
const router = express.Router();

// 비밀번호 변경 엔드포인트
router.post('/change-password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // 세션에서 사용자 ID 가져오기
    const userId = req.session.user ? req.session.user._id : null;

    if (!userId) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    try {
        // 사용자 조회
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        // 현재 비밀번호 검증
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: '현재 비밀번호가 일치하지 않습니다.' });
        }

        // 새 비밀번호 해싱 및 저장
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;
