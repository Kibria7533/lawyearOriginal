// const { DataTypes } = require("sequelize");
// const db = require("../db");
// const Category = require("./Category");
// const Subcategory = require("./Subcategory");

const Role_Permission = (db, DataTypes) =>
    db.define(
        "role_permission",
        {
            role_id: {
                type: DataTypes.INTEGER,
               required:true
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
            timestamp:true,
        }
    );

module.exports = Role_Permission;
