const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const User = require('./User')(sequelize, DataTypes);
const StudentProfile = require('./StudentProfile')(sequelize, DataTypes);
const RecruiterProfile = require('./RecruiterProfile')(sequelize, DataTypes);
const Job = require('./Job')(sequelize, DataTypes);
const Application = require('./Application')(sequelize, DataTypes);

// Associations
User.hasOne(StudentProfile, { foreignKey: 'userId', as: 'studentProfile' });
StudentProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(RecruiterProfile, { foreignKey: 'userId', as: 'recruiterProfile' });
RecruiterProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Job, { foreignKey: 'recruiterId', as: 'jobs' });
Job.belongsTo(User, { foreignKey: 'recruiterId', as: 'recruiter' });

User.hasMany(Application, { foreignKey: 'studentId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

module.exports = {
    sequelize,
    User,
    StudentProfile,
    RecruiterProfile,
    Job,
    Application
};
