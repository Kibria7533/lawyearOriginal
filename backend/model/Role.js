// const { DataTypes } = require("sequelize");
// const db = require("../db");
// const Category = require("./Category");
// const Subcategory = require("./Subcategory");

const Role = (db, DataTypes) =>
    db.define(
        "role",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                required:true,
            },
            active: {
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

module.exports = Role;
