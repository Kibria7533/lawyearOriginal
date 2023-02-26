// const { DataTypes } = require("sequelize");
// const db = require("../db");
// const Category = require("./Category");
// const Question = require("./Question");
// const User = require("./User");

const Document = (db, DataTypes) =>
  db.define(
    "document",
    {
      name: { type: DataTypes.STRING, defaultValue: "" },
    },

    { underscored: true }
  );

module.exports = Document;
