const CategorySubCategory = (db, DataTypes) =>
  db.define(
    "category_sub_category",
    {
      subcategory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { underscored: true }
  );

// one category can have multiple question
// Category.hasMany(Question);
// Category.hasMany(Subcategory);
// Category.associate = (model) => {
//   Category.belongsTo(model.user);
// };

module.exports = CategorySubCategory;
