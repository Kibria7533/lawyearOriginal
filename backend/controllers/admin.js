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
            "designation",
            "office_id",
            "email",
            "phone",
            "education",
            "work_experince",
            "chember",
            "per_minute_charge",
            "per_hour_charge",
            "per_day_charge",
            "per_case_charge",
          "lawyer_categories",
          "profile_pic",
          "role",
        ],
      });

     res.json(user);

    } catch (err) {
      res.status(400).json(err?.message || err);
    }
  },
  //
  // deleteUser: async (req, res) => {
  //
  //   try {
  //     const deleteUser = await UserModel.delete({});
  //     res.status(200).json({ deleteUser });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
};
