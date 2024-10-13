const Recruit = require('../models/recruitModel');

// 친구 모집 글 저장
exports.createRecruit = async (req, res) => {
    try {
        // 세션에서 사용자 정보 가져오기
        const { username, nickname } = req.session.user;
        if (!username || !nickname) {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }

        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: '제목과 설명을 입력해주세요.' });
        }

        // 새로운 모집 글 생성
        const newRecruit = new Recruit({
            title,
            description,
            authorUsername: username,  // 세션에서 가져온 사용자 username
            authorNickname: nickname,  // 세션에서 가져온 사용자 nickname
        });

        await newRecruit.save();  // DB에 저장
        res.status(201).json({ message: '친구 모집 글이 성공적으로 등록되었습니다.' });
    } catch (error) {
        console.error('친구 모집 글 저장 중 오류 발생:', error);
        res.status(500).json({ message: '서버에서 오류가 발생했습니다.' });
    }
};

// 친구 모집 글 목록 불러오기
exports.getRecruits = async (req, res) => {
    try {
        const recruits = await Recruit.find();  // 모든 모집 글 가져오기
        res.status(200).json({ recruits });
    } catch (error) {
        console.error('친구 모집 글 목록 불러오기 중 오류 발생:', error);
        res.status(500).json({ message: '서버에서 오류가 발생했습니다.', error: error.message });
    }
};
