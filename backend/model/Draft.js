const Draft = (db, DataTypes) =>
  db.define(
    "draft",
    {
      value: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
      requestId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      underscored: true,
    }
  );

module.exports = Draft;
