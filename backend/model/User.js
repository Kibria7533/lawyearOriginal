// const { DataTypes } = require("sequelize");
// const db = require("../db");
// const Category = require("./Category");
// const Subcategory = require("./Subcategory");

const User = (db, DataTypes) =>
  db.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      first_name: {
        type: DataTypes.STRING,
        required:true,
      },
      last_name: {
        type: DataTypes.STRING,
        required:true,
      },
        office_id: {
            type: DataTypes.INTEGER,
            required:true,
        },
      designation: {
        type: DataTypes.STRING,
          required:true,
      },
      email: {
        type: DataTypes.STRING,
        required:true
      },
      pass: {
        type: DataTypes.STRING,
        required:true
      },
        phone: {
            type: DataTypes.INTEGER,
            required:true
        },
      education: {
        type: DataTypes.STRING,
        required:true
      },
      work_experince: {
        type: DataTypes.STRING,
        required:true
      },
      chember: {
        type: DataTypes.STRING,
        required:true
      },
        per_minute_charge: {
            type: DataTypes.INTEGER,
            required:true
        },
        per_hour_charge: {
            type: DataTypes.INTEGER,
            required:true
        },
        per_day_charge: {
            type: DataTypes.INTEGER,
            required:true
        },
        per_case_charge: {
            type: DataTypes.INTEGER,
            required:true
        },
      stripe_customer_id: {
        type: DataTypes.STRING,
      },
      stripe_subscription_id: {
        type: DataTypes.STRING,
      },
      lawyer_categories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      profile_pic: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "lawyer",
      },
    },
    {
      underscored: true,
    }
  );

module.exports = User;
