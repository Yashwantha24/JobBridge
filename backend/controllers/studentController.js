const { StudentProfile, Application, Job, User } = require('../models');
const atsAnalyzer = require('../utils/atsAnalyzer');

exports.getProfile = async (req, res) => {
    try {
        let profile = await StudentProfile.findOne({ where: { userId: req.user.id } });
        if (!profile) {
            profile = await StudentProfile.create({ userId: req.user.id });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { skills, education, experience } = req.body;
        let profile = await StudentProfile.findOne({ where: { userId: req.user.id } });

        if (!profile) {
            profile = await StudentProfile.create({ userId: req.user.id });
        }

        profile.skills = skills;
        profile.education = education;
        profile.experience = experience;
        await profile.save();

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        let profile = await StudentProfile.findOne({ where: { userId: req.user.id } });
        if (!profile) {
            profile = await StudentProfile.create({ userId: req.user.id });
        }
        profile.resumeUrl = req.file.path; // Or upload to cloud storage and get URL
        await profile.save();

        res.json({ message: 'Resume uploaded successfully', filePath: req.file.path });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.applyJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const studentId = req.user.id; // From Auth Middleware

        // Check if already applied
        const existingApplication = await Application.findOne({ where: { jobId, studentId } });
        if (existingApplication) return res.status(400).json({ message: 'Already applied' });

        // Get Student Resume
        const studentProfile = await StudentProfile.findOne({ where: { userId: studentId } });
        if (!studentProfile || !studentProfile.resumeUrl) {
            return res.status(400).json({ message: 'Please upload resume first' });
        }

        // Get Job Skills
        const job = await Job.findByPk(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // ATS Analysis
        const atsResult = await atsAnalyzer(studentProfile.resumeUrl, job.skillsRequired);

        if (atsResult.valid === false) {
            return res.status(400).json({
                message: `Application Rejected: ${atsResult.message}`
            });
        }

        // Create Application
        const application = await Application.create({
            jobId,
            studentId: req.user.id,
            resumeUrl: studentProfile.resumeUrl,
            atsScore: atsResult.score,
            missingKeywords: atsResult.missingKeywords,
            status: 'applied'
        });
        res.status(201).json({ message: 'Applied successfully', application });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.findAll({
            where: { studentId: req.user.id },
            include: [{ model: Job, as: 'job' }]
        });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
