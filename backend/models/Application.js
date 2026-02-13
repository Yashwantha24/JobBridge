module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('Application', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        jobId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'jobs',
                key: 'id'
            }
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        resumeUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        atsScore: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0
        },
        status: {
            type: DataTypes.ENUM('applied', 'shortlisted', 'rejected'),
            defaultValue: 'applied'
        },
        missingKeywords: {
            type: DataTypes.TEXT, // Store as JSON string or CSV
            get() {
                const rawValue = this.getDataValue('missingKeywords');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(val) {
                this.setDataValue('missingKeywords', JSON.stringify(val));
            }
        }
    }, {
        tableName: 'applications',
        timestamps: true
    });

    return Application;
};
