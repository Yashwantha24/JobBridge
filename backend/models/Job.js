module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define('Job', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        recruiterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING
        },
        salary: {
            type: DataTypes.STRING
        },
        jobType: {
            type: DataTypes.STRING // Full-time, Internship, etc.
        },
        skillsRequired: {
            type: DataTypes.TEXT,
            get() {
                const rawValue = this.getDataValue('skillsRequired');
                return rawValue ? rawValue.split(',') : [];
            },
            set(val) {
                this.setDataValue('skillsRequired', Array.isArray(val) ? val.join(',') : val);
            }
        }
    }, {
        tableName: 'jobs',
        timestamps: true
    });

    return Job;
};
