const express = require('express');
const { createSchedule } = require('../controllers/scheduleController');
const router = express.Router();

router.post('/schedule', createSchedule);

module.exports = router;