// const { DataTypes } = require("sequelize");
// const db = require("../db");
// const Category = require("./Category");

const Option = (db, DataTypes) =>
  db.define(
    "option",
    {
      value: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      position: {
        type: DataTypes.INTEGER,
      },
    },
    {
      underscored: true,
    }
  );

// but one question only have one category
// Question.belongsTo(Category);
// Question.associate = (model) => {
//   Question.belongsTo(model.category);
// };

module.exports = Option;
