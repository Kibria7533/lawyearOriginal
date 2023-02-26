const RequestQuestionAnswer = (db, DataTypes) =>
  db.define(
    "request_question_answer",
    {
      ans: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
    },
    {
      underscored: true,
    }
  );

module.exports = RequestQuestionAnswer;
