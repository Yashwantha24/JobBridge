module.exports = (sequelize, DataTypes) => {
    const StudentProfile = sequelize.define('StudentProfile', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        skills: {
            type: DataTypes.TEXT, // Stored as comma-separated string or JSON
            get() {
                const rawValue = this.getDataValue('skills');
                return rawValue ? rawValue.split(',') : [];
            },
            set(val) {
                this.setDataValue('skills', Array.isArray(val) ? val.join(',') : val);
            }
        },
        education: {
            type: DataTypes.TEXT
        },
        experience: {
            type: DataTypes.TEXT
        },
        resumeUrl: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'student_profiles',
        timestamps: false
    });

    return StudentProfile;
};
