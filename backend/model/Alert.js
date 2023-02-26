const addZero = require("add-zero");

const Alert = (db, DataTypes) => {
  const AlertModel = db.define(
    "alert",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      questionId: {
        type: DataTypes.INTEGER,
      },
      documentId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      underscored: true,
    }
  );
  return AlertModel;
};

module.exports = Alert;
