const User_Role = (db, DataTypes) =>
    db.define(
        "user_role",
        {
            user_id: {
                type: DataTypes.INTEGER,
                required:true,
            },

            role_id: {
                type: DataTypes.INTEGER,
                required:true,
            },
        },
        {
            underscored: true,
        },
    );

module.exports = User_Role;
