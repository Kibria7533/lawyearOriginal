const { Sequelize, Op, where} = require("sequelize");
const {RoleModel} =require('../db')
const {assertArray} = require("@babel/core/lib/config/validation/option-assertions");

module.exports={
    getRole:async (req,res)=>{
        try{
            const role=await RoleModel.findAll({})
            res.json(role);
        }catch (err){
            res.status(400).json({ err: "some mismatch!" });
        }
    },

    postRole:async (req,res)=>{
        const {id,name,active}=req.body;
        if(!id || !name || !active){
            return res.status(404).json({ err: "Some data have problem!" });
        }
        try{
            const createRole=await RoleModel.create({id,name,active})
            res.status(201).json({ success: true, createRole });

        }catch (err){
            res.status(400).json({ err: "some mismatch!" });
        }
    },

    updateRole:async (req,res)=>{
        const pId=req.params.id
        const {id,name,active}=req.body;

        if(!name || !active){
            return res.status(404).json({ err: "Some data have problem!" });
        }
        try{
            const roleUpdate=await RoleModel.update({id,name,active},{where:{id:pId}})
            res.status(201).json({ success: true, roleUpdate });
        }catch(err){
            res.status(400).json({ err: "some mismatch!" });
        }
    },
    getSingleRole:async (req,res)=>{
        const id = req.params.id;
        try {
            let singleRole=await RoleModel.findOne({where:{id:id}})
            res.json(singleRole);
        }catch (err){
            res.status(404).json({ err: "invalid id" });
        }
    },
    deleteRole:async (req,res)=>{
        let id=req.params.id
        try{
            let roleDelete= await  RoleModel.destroy({where:{id:id}})
            res.status(200).json({roleDelete})
        }catch (err){
            res.status(404).json({ err: "invaild id" });
        }

    }

}