const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// 회원가입 처리
exports.signup = async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: '모든 항목을 입력해주세요.' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '이미 사용 중인 아이디입니다.' });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword, email });
        await newUser.save();

        res.status(201).json({ message: '회원가입 성공!' });
    } catch (error) {
        console.error('회원가입 중 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다. 다시 시도해주세요.' });
    }
};

// 로그인 처리
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }

        // 비밀번호 비교
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }

        // 로그인 성공 시 세션에 사용자 정보 저장
        req.session.user = user;  // 세션에 사용자 정보 저장
        res.status(200).json({ message: '로그인 성공!' });
    } catch (error) {
        console.error('로그인 중 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다. 다시 시도해주세요.' });
    }
};
