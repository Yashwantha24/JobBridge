const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.post('/', authMiddleware, jobController.createJob);

module.exports = router;
