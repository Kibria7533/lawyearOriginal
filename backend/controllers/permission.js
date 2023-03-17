const {Sequelize, sequilize, Op, where} = require("sequelize");
const {
    PermissionModel,
    UserModel,
    RequestModel,
    RequestQuestionModel,
    RequestQuestionAnswerModel,
    RequestDocumentModel
} = require('../db')
const {assertArray} = require("@babel/core/lib/config/validation/option-assertions");

module.exports = {
    getPermission: async (req, res) => {
        try {
            const permission = await PermissionModel.findAll({})
            res.json(permission);
        } catch (err) {
            res.status(400).json({err: "some mismatch!"});
        }
    },
    getPermissionByEachTableName: async (req, res) => {
        try {
            const permissionTableName =
                await PermissionModel.findAll({
                    attributes: ["table_name",
                        [Sequelize.fn('STRING_AGG', Sequelize.col('permission_key'),","), 'permission_key']
                    ],
                    group: ['table_name']
                });
            res.json(permissionTableName);
        } catch (err) {
            console.log(err)
            res.status(400).json({err: "some mismatch!"});
        }
    },

    postPermission: async (req, res) => {
        const {id, permission_key, table_name, description, active} = req.body;
        if (!permission_key || !table_name || !description || !active) {
            return res.status(404).json({err: "Some data have problem!"});
        }
        try {
            const permission = await PermissionModel.create({...req.body})
            res.status(200).json({permission})

        } catch (err) {
            console.log(err)
            res.status(400).json({err: "some mismatch!"});
        }
    },
    updatePermission: async (req, res) => {
        const pId = req.params.id
        const {id, slug, description, active} = req.body;

        if (!slug || !description || !active) {
            return res.status(404).json({err: "Some data have problem!"});
        }
        try {
            const updatePermission = await PermissionModel.update({id, slug, description, active}, {where: {id: pId}})
            res.status(201).json({success: true, updatePermission});
        } catch (err) {
            res.status(400).json({err: "some mismatch!"});
        }
    },

    getOnePermission: async (req, res) => {
        let id = req.params.id
        try {
            let signlePermission = await PermissionModel.findOne({where: {id: id}})
            res.json(signlePermission);
        } catch (err) {
            res.status(404).json({err: "invalid id f"});
        }

    },
    deletePermission: async (req, res) => {
        let id = req.params.id
        try {
            let deletePermission = await PermissionModel.destroy({where: {id: id}})
            res.status(200).json({deletePermission})
        } catch (err) {
            res.status(404).json({err: "invaild id s"});
        }

    }
}
