const {RolePermissionModel}=require('../db')

module.exports={

    getRolePermission:async (req,res)=>{
        try {
            let allRolePermission= await  RolePermissionModel.findAll({})
            res.status(200).json({allRolePermission})
        }catch (err){
            res.status(400).json({ err: "not a role permission" });
        }
    },
    postRolePermission:async (req,res)=>{
        let {role_id,permission_id}=req.body;
        if(!role_id || !permission_id){
            res.status(404).json({ err: "Some data have problem!" })
        }
        try{
            let createRolePermission=await RolePermissionModel.create({role_id,permission_id});
            res.status(200).json({createRolePermission})
        }catch (err){
            res.status(400).json({ err: "some mismatch!" });
        }
    },
    getSingleRolePermission:async (req,res)=>{
        let id=req.params.id
        try {
            let signleRolePermission=await RolePermissionModel.findOne({where:{id:id}})
            res.status(200).json({signleRolePermission})
        }catch (err){
            res.status(404).json({ err: "invalid id" });
        }
    },
    updateSingleRolePermission:async (req,res)=>{
        let id=req.params.id
        let {role_id,permission_id}=req.body;

        if(!role_id || !permission_id){
            res.status(404).json({ err: "Some data have problem!" })
        }

        try {
            let updateSingleRolePermission=await RolePermissionModel.update({role_id,permission_id},{where:{id:id}})
            res.status(200).json({updateSingleRolePermission})
        }catch (err){
            res.status(404).json({ err: "invalid id" });
        }
    },
    deleteRolePermission:async (req,res)=>{
        let id=req.params.id;
        try {
            let deleteSingleRolePermission=await RolePermissionModel.destroy({where:{id:id}})
            res.status(200).json({deleteSingleRolePermission})
        }catch (err){
            res.status(404).json({ err: "invalid id" });
        }
    }
}