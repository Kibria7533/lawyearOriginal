const { Sequelize, Op, where} = require("sequelize");
const {UserPermissionModel} =require('../db')
const {assertArray} = require("@babel/core/lib/config/validation/option-assertions");

module.exports={
    getAllUserPermission:async (req,res)=>{
        try{
            const userPermission=await UserPermissionModel.findAll({})
            res.json(userPermission);
        }catch (err){
            res.status(400).json({ err: "some mismatch!" });
        }
    },

    postUserPermission:async (req,res)=>{
        const {user_id,permission_id}=req.body;
        if(!user_id ||  !permission_id){
            return res.status(404).json({ err: "Some data have problem!" });
        }
        try{
            const createUserPermission=await UserPermissionModel.create({user_id,permission_id})
            res.status(201).json({ success: true, createUserPermission });

        }catch (err){
            res.status(400).json({ err: "some mismatch!" });
        }
    },

    updateSingleUserPermission:async (req,res)=>{
        const id=req.params.id
        const {user_id,permission_id}=req.body;
        if(!user_id ||  !permission_id){
            return res.status(404).json({ err: "Some data have problem!" });
        }
        try{
            const userPermissionUpdate=await UserPermissionModel.update({user_id,permission_id},{where:{id:id}})
            res.status(201).json({ success: true, userPermissionUpdate });
        }catch(err){
            res.status(400).json({ err: "some mismatch!" });
        }
    },

    getSingleUserPermission:async (req,res)=>{
        const id = req.params.id;
        try {
            let singleUserPermission=await UserPermissionModel.findOne({where:{id:id}})
            res.json(singleUserPermission);
        }catch (err){
            res.status(404).json({ err: "invalid id" });
        }
    },

    deleteUserPermission:async (req,res)=>{
        let id=req.params.id
        try{
            let userPermissionDelete= await  UserPermissionModel.destroy({where:{id:id}})
            res.status(200).json({userPermissionDelete})
        }catch (err){
            res.status(404).json({ err: "invaild id" });
        }

    }

}