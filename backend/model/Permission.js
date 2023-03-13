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
           permission_key: {
                type: DataTypes.STRING,
                required:true
            },
            table_name: {
                type: DataTypes.STRING,
                required:true
            },
            description: {
                type: DataTypes.STRING,
            },
            active: {
                type: DataTypes.INTEGER,
            },
        },
        {
            underscored: true,
        }
    );

module.exports = Permission;
