const { Job, RecruiterProfile } = require('../models');
const { Op } = require('sequelize');
const Joi = require('joi');

const jobSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    salary: Joi.string().required(),
    jobType: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship').required(),
    skillsRequired: Joi.string().required() // Assuming CSV string for now
});

exports.createJob = async (req, res, next) => {
    try {
        if (req.user.role !== 'recruiter') {
            res.status(403);
            throw new Error('Access denied. Only recruiters can post jobs.');
        }

        const { error } = jobSchema.validate(req.body);
        if (error) {
            res.status(400);
            throw new Error(error.details[0].message);
        }

        const { title, description, location, salary, jobType, skillsRequired } = req.body;

        const job = await Job.create({
            recruiterId: req.user.id,
            title,
            description,
            location,
            salary,
            jobType,
            skillsRequired
        });

        res.status(201).json(job);
    } catch (error) {
        next(error);
    }
};

exports.getAllJobs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, type, location } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
                { skillsRequired: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (type) {
            whereClause.jobType = type;
        }

        if (location) {
            whereClause.location = { [Op.iLike]: `%${location}%` };
        }

        const { count, rows } = await Job.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            jobs: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        next(error);
    }
};

exports.getJobById = async (req, res, next) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }
        res.json(job);
    } catch (error) {
        next(error);
    }
};
