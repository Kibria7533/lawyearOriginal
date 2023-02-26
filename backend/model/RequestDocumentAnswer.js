const RequestDocumentAnswer = (db, DataTypes) =>
  db.define(
    "request_document_answer",
    {
      link: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
    },
    {
      underscored: true,
    }
  );

module.exports = RequestDocumentAnswer;
