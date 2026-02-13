module.exports = (sequelize, DataTypes) => {
    const RecruiterProfile = sequelize.define('RecruiterProfile', {
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
        companyName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        companyWebsite: {
            type: DataTypes.STRING
        },
        companyDescription: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'recruiter_profiles',
        timestamps: false
    });

    return RecruiterProfile;
};
