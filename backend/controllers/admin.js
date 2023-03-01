const { UserModel } = require("../db");


module.exports = {
   getServiceProviders: async function (req, res) {
    try {
      
      const user = await UserModel.findAll({}, {
        attributes: [
          "id",
          "user_id",
          "email",
          "first_name",
          "last_name",
          "lawyer_categories",
          "profile_pic",
          "role",
        ],
      });

      res.json(user);
    } catch (err) {
      res.status(400).json(err?.message || err);
    }
  }
};
