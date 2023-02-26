const RequestQuestion = (db, DataTypes) =>
  db.define(
    "request_question",
    {
      ques: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: "subcategory",
      },
      position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      questionType: {
        type: DataTypes.STRING,
      },
      options: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      high_priority: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      underscored: true,
    }
  );

module.exports = RequestQuestion;
