// const { DataTypes } = require("sequelize");
// const db = require("../db");
// const Category = require("./Category");
// const Subcategory = require("./Subcategory");

const Permission = (db, DataTypes) =>
    db.define(
        "permission",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            slug: {
                type: DataTypes.STRING,
                required:true
            },
            description: {
                type: DataTypes.STRING,
                required:true
            },
            active: {
                type: DataTypes.INTEGER,
                required:true,
            },
        },
        {
            underscored: true,
        }
    );

module.exports = Permission;
