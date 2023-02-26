const Category = (db, DataTypes) =>
  db.define(
    "category",
    {
      name: { type: DataTypes.STRING, defaultValue: "" },
      // userId: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     model: "user",
      //     key: "userId",
      //   },
      // },
    },
    { underscored: true }
  );

// one category can have multiple question
// Category.hasMany(Question);
// Category.hasMany(Subcategory);
// Category.associate = (model) => {
//   Category.belongsTo(model.user);
// };

module.exports = Category;
