const { RecruiterProfile, Job, Application, User, StudentProfile } = require('../models');

exports.getProfile = async (req, res) => {
    try {
        const profile = await RecruiterProfile.findOne({ where: { userId: req.user.id } });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { companyName, companyWebsite, companyDescription } = req.body;
        const profile = await RecruiterProfile.findOne({ where: { userId: req.user.id } });

        profile.companyName = companyName;
        profile.companyWebsite = companyWebsite;
        profile.companyDescription = companyDescription;
        await profile.save();

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Check ownership
        const job = await Job.findOne({ where: { id: jobId, recruiterId: req.user.id } });
        if (!job) return res.status(403).json({ message: 'Access denied or Job not found' });

        const applications = await Application.findAll({
            where: { jobId },
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['name', 'email', 'phone']
                }
            ]
        });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body; // 'shortlisted', 'rejected'

        const application = await Application.findByPk(applicationId, {
            include: [{ model: Job, as: 'job' }]
        });

        if (!application) return res.status(404).json({ message: 'Application not found' });

        // Verify Recruiter owns the job
        if (application.job.recruiterId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({ where: { recruiterId: req.user.id } });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
