const User = require('../models/userModel');

// 회원가입 처리
exports.signup = async (req, res) => {
    const { username, password, email } = req.body;

    // 유효성 검사
    if (!username || !password || !email) {
        return res.status(400).json({ message: '모든 항목을 입력해주세요.' });  // JSON 형식으로 오류 반환
    }

    try {
        // 기존 사용자 확인
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '이미 사용 중인 아이디입니다.' });  // JSON 형식으로 응답
        }

        // 새로운 유저 생성 및 데이터베이스 저장
        const newUser = new User({ username, password, email });
        await newUser.save();

        res.status(201).json({ message: '회원가입 성공!' });  // 회원가입 성공 시 JSON 형식 응답
    } catch (error) {
        console.error('회원가입 중 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다. 다시 시도해주세요.' });  // 서버 오류 시에도 JSON 응답
    }
};

// 로그인 처리
exports.login = async (req, res) => {
    const { username, password } = req.body;

    // 유효성 검사
    if (!username || !password) {
        return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });  // JSON 형식으로 오류 반환
    }

    try {
        // 사용자 확인
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });  // JSON 형식으로 응답
        }

        // 로그인 성공
        res.status(200).json({ message: '로그인 성공!' });  // 로그인 성공 시 JSON 형식 응답
    } catch (error) {
        console.error('로그인 중 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다. 다시 시도해주세요.' });  // 서버 오류 시에도 JSON 응답
    }
};
