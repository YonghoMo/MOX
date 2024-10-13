const Recruit = require('../models/recruitModel');

// 친구 모집 글 저장
exports.createRecruit = async (req, res) => {
    try {
        // 세션에서 사용자 정보 가져오기
        const { username, nickname, _id: userId } = req.session.user; // 사용자 ID도 가져옴
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
            authorId: userId, // authorId에 사용자 ID 저장
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

// 친구 모집 글 삭제하기
exports.deleteRecruit = async (req, res) => {
    const recruitId = req.params.id;  // URL에서 recruitId를 가져옴
    const userId = req.session.user;  // 세션에서 현재 사용자의 ID 가져옴

    console.log("모집 글 ID:", recruitId);  // 삭제할 글의 ID
    console.log("현재 사용자 ID:", userId);  // 세션에서 가져온 사용자 ID

    try {
        const recruit = await Recruit.findById(recruitId);
        if (!recruit) {
            return res.status(404).json({ message: '모집 글을 찾을 수 없습니다.' });
        }

        // 작성자 ID가 일치하는지 확인
        if (!recruit.authorId || recruit.authorId.toString() !== userId.toString()) {
            return res.status(403).json({ message: '자신의 글만 삭제할 수 있습니다.' });
        }

        await Recruit.findByIdAndDelete(recruitId);  // 모집 글 삭제
        res.status(200).json({ message: '모집 글이 삭제되었습니다.' });
    } catch (error) {
        console.error('모집 글 삭제 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
