const { Sequelize, Op, where} = require("sequelize");
const {PermissionModel} =require('../db')
const {assertArray} = require("@babel/core/lib/config/validation/option-assertions");

module.exports={
    getPermission:async (req,res)=>{
        try{
            const permission=await PermissionModel.findAll({})
            res.status(201).json({ success: true, permission });
        }catch (err){
            res.status(400).json({ err: "some mismatch!" });
        }
    },
    postPermission:async (req,res)=>{
        const {id,slug,description,active}=req.body;
        if(!slug || !description || !active){
            return res.status(404).json({ err: "Some data have problem!" });
        }
        try{
            const permission=await PermissionModel.create({id,slug,description,active})
            res.status(200).json({permission})

        }catch (err){
            res.status(400).json({ err: "some mismatch!" });
        }
    },
    updatePermission:async (req,res)=>{
        const pId=req.params.id
        const {id,slug,description,active}=req.body;

        if(!slug || !description || !active){
            return res.status(404).json({ err: "Some data have problem!" });
        }
        try{
            const updatePermission=await PermissionModel.update({id,slug,description,active},{where:{id:pId}})
            res.status(201).json({ success: true, updatePermission });
        }catch(err){
            res.status(400).json({ err: "some mismatch!" });
        }
    },

    getOnePermission:async (req,res)=>{
        let id=req.params.id
        try {
            let signlePermission=await PermissionModel.findOne({where:{id:id}})
            res.status(200).json({signlePermission})
        }catch (err){
            res.status(404).json({ err: "invalid id" });
        }

    },
    deletePermission:async (req,res)=>{
        let id=req.params.id
        try{
            let deletePermission= await  PermissionModel.destroy({where:{id:id}})
            res.status(200).json({deletePermission})
        }catch (err){
            res.status(404).json({ err: "invaild id" });
        }

    }
}
