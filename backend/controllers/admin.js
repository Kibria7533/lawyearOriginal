const { UserModel } = require("../db");
const {where} = require("sequelize");


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

  getServiceProvidersSingleUser:async (req,res)=>{
    const id=req.params.id;
    try{
      const singleUser=await  UserModel.findOne({where:{id:id}})
      res.status(201).json({ success: true, singleUser });
    }catch (err){
      console.log(err);
      res.status(400).json({ err: "some mismatch!" });
    }
  },
  updateServiceProvidersSingleUser:async (req,res)=>{
     const id=req.params.id;
     const {
       first_name,
       last_name,
       designation,
       office_id,
       email,
       pass,
       phone,
       education,
       work_experince,
       chember,
       per_minute_charge,
       per_hour_charge,
       per_day_charge,
       per_case_charge,
       role}=req.body;
     try{
       const updateUser=await  UserModel.update({
         first_name,
         last_name,
         designation,
         office_id,
         email,
         pass,
         phone,
         education,
         work_experince,
         chember,
         per_minute_charge,
         per_hour_charge,
         per_day_charge,
         per_case_charge,
         role},{where:{id:id}})
       res.status(201).json({ success: true, updateUser });
     }catch (err){
       console.log(err);
       res.status(400).json({ err: "some mismatch!" });
     }
  },

  deleteServiceProviders: async (req, res) => {
        const id =req.params.id
    try {
      const deleteUser = await UserModel.destroy({where:{id:id}});
      res.status(200).json({ deleteUser });
    } catch (err) {
      console.log(err);
    }
  },

};
