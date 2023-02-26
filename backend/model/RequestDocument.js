const RequestDocument = (db, DataTypes) =>
  db.define(
    "request_documents",
    {
      name: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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

module.exports = RequestDocument;
