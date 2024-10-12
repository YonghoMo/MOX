const Schedule = require('../models/scheduleModel');

// 일정 추가 기능
exports.createSchedule = async (req, res) => {
    const { title, start, end, userId } = req.body;
    const schedule = new Schedule({ title, start, end, userId });
    await schedule.save();  // DB에 저장
    res.status(201).json({ message: 'Schedule created', schedule });
};

// 일정 조회 기능
exports.getSchedule = async (req, res) => {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
};
