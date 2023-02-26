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
        defaultValue: "",
      },
      last_name: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      email: {
        type: DataTypes.STRING,
      },
      pass: {
        type: DataTypes.STRING,
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
