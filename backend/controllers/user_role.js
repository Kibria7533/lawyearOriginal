const { Sequelize, Op, where} = require("sequelize");
const {UserRoleModel} =require('../db')
const {assertArray} = require("@babel/core/lib/config/validation/option-assertions");

module.exports={
    getAllUserRole:async (req,res)=>{
        try{
            const userRole=await UserRoleModel.findAll({})
            res.json(userRole);
        }catch (err){
            res.status(400).json({ err: "some mismatch!" });
        }
    },

    postUserRole:async (req,res)=>{
        const {user_id,role_id}=req.body;
        if(!user_id ||  !role_id){
            return res.status(404).json({ err: "Some data have problem!" });
        }
        try{
            const createUserRole=await UserRoleModel.create({user_id,role_id})
            res.status(201).json({ success: true, createUserRole });

        }catch (err){
            res.status(400).json({ err: "some mismatch!" });
        }
    },

    updateSingleUserRole:async (req,res)=>{
        const pId=req.params.id
        const {user_id,role_id}=req.body;
        if(!user_id ||  !role_id){
            return res.status(404).json({ err: "Some data have problem!" });
        }
        try{
            const userRoleUpdate=await UserRoleModel.update({user_id,role_id},{where:{id:pId}})
            res.status(201).json({ success: true, userRoleUpdate });
        }catch(err){
            res.status(400).json({ err: "some mismatch!" });
        }
    },

    getSingleUserRole:async (req,res)=>{
        const id = req.params.id;
        try {
            let singleUSerRole=await UserRoleModel.findOne({where:{id:id}})
            res.json(singleUSerRole);
        }catch (err){
            res.status(404).json({ err: "invalid id" });
        }
    },
    deleteUserRole:async (req,res)=>{
        let id=req.params.id
        try{
            let userRoleDelete= await  UserRoleModel.destroy({where:{id:id}})
            res.status(200).json({userRoleDelete})
        }catch (err){
            res.status(404).json({ err: "invaild id" });
        }

    }

}