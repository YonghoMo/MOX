const User = require('../models/userModel');

// 회원가입 기능
exports.createUser = async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();  // DB에 저장
    res.status(201).json({ message: 'User created', user });
};

// 유저 정보 조회 기능
exports.getUser = async (req, res) => {
    const user = await User.findById(req.params.id);  // 유저 조회
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
};