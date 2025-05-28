const express = require('express');
const router = express.Router();
const { listInstances, getCpuUsage } = require('../controllers/ec2Controller');

router.get('/instances', listInstances);
router.get('/cpu-usage', getCpuUsage);

module.exports = router;
