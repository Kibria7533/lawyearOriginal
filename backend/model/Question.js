// const { DataTypes } = require("sequelize");
// const db = require("../db");
// const Category = require("./Category");

const Question = (db, DataTypes) =>
  db.define(
    "question",
    {
      ques: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      type: {
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

module.exports = Question;
