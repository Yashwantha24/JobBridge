const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { User, StudentProfile, RecruiterProfile } = require('../models');

// Validation Schemas
const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('student', 'recruiter').required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

exports.register = async (req, res, next) => {
    try {
        // Validate Input
        const { error } = registerSchema.validate(req.body);
        if (error) {
            res.status(400);
            throw new Error(error.details[0].message);
        }

        const { name, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const user = await User.create({
            name,
            email,
            password_hash: hashedPassword,
            role
        });

        // Create Profile based on role
        if (role === 'student') {
            await StudentProfile.create({ userId: user.id });
        } else if (role === 'recruiter') {
            await RecruiterProfile.create({ userId: user.id, companyName: name + " Company" });
        }

        res.status(201).json({
            message: 'User created successfully',
            user: { id: user.id, name: user.name, role: user.role }
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        // Validate Input
        const { error } = loginSchema.validate(req.body);
        if (error) {
            res.status(400);
            throw new Error(error.details[0].message);
        }

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(401);
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            res.status(401);
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: { id: user.id, name: user.name, role: user.role }
        });
    } catch (error) {
        next(error);
    }
};
