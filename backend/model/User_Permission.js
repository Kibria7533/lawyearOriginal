// const { DataTypes } = require("sequelize");
// const db = require("../db");
// const Category = require("./Category");
// const Subcategory = require("./Subcategory");

const User_Permission = (db, DataTypes) =>
    db.define(
        "user_permission",
        {
            user_id: {
                type: DataTypes.INTEGER,
                required:true,
            },

            permission_id: {
                type: DataTypes.INTEGER,
                required:true,
            },
        },
        {
            underscored: true,
        },
        {
            timestamp:true
        }
    );

module.exports = User_Permission;
