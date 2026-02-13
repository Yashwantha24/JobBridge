const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authMiddleware);

router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.post('/upload-resume', upload.single('resume'), studentController.uploadResume);
router.post('/apply', studentController.applyJob); // This needs resume uploaded first, or send result in body? Controller assumes uploaded previously.
router.get('/applications', studentController.getMyApplications);

module.exports = router;
