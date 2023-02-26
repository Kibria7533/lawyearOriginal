const Comment = (db, DataTypes) =>
  db.define(
    "comments",
    {
      desc: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
    },
    {
      underscored: true,
    }
  );

module.exports = Comment;
