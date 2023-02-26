// const { DataTypes } = require("sequelize");
// const db = require("../db");
// const Category = require("./Category");
// const Question = require("./Question");
// const User = require("./User");

const Subcategory = (db, DataTypes) =>
  db.define(
    "subcategory",
    {
      name: { type: DataTypes.STRING, defaultValue: "" },
      // categoryId: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     model: "category",
      //     key: "categoryId",
      //   },
      // },
      // userId: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     model: "user",
      //     key: "userId",
      //   },
      // },
    },

    { underscored: true }
  );

// one category can have multiple question
// Subcategory.hasMany(Question);
// Subcategory.associate = (model) => {
//   Subcategory.belongsTo(model.user);
//   Subcategory.belongsTo(model.category);
//   console.log(model)
// };
// Subcategory.associate = (model) => {
//   Subcategory.belongsTo(model.category);
// };
// Subcategory.belongsTo(User)
// Subcategory.belongsTo(Category)

module.exports = Subcategory;
