const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/profile', recruiterController.getProfile);
router.put('/profile', recruiterController.updateProfile);
router.get('/jobs', recruiterController.getMyJobs);
router.get('/applications/:jobId', recruiterController.getJobApplications);
router.put('/application/:applicationId/status', recruiterController.updateApplicationStatus);

module.exports = router;
