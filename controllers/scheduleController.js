const Schedule = require('../models/scheduleModel');

exports.createSchedule = async (req, res) => {
    const { title, start, end, userId } = req.body;
    const schedule = new Schedule({ title, start, end, userId });
    await schedule.save();
    res.status(201).json({ message: 'Schedule created', schedule });
};