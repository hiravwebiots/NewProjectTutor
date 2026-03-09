const rolePemissionModel = require('../models/rolePermissionModel')
const roleModel = require('../models/roleModel')
const permissionModel = require('../models/permissionModel')

const createRolePermission = async (req, res) => {
    try{
        const { RoleId, PermissionId } = req.body

        // == validate RoleId ==
        if(!RoleId || !PermissionId){
            return res.status(400).json({ status : 0, message : "role or permission is requires" })
        }

        const role = await roleModel.findById(RoleId)
        if(!role){
            return res.status(404).json({ status : 0, message : "role not found" })
        }

        const permission = await permissionModel.findById(PermissionId)
        if(!permission){
            return res.status(404).json({ status : 0, message : "permission not found" })
        }

        const exist = await rolePemissionModel.findOne({
            RoleId,
            PermissionId
        })

        if(exist){
            return res.status(400).json({ status : 0, mesaage : "Already Exist" })
        }

        const assignPermission = await rolePemissionModel.create({
            RoleId,
            PermissionId
        })

        res.status(201).json({ status : 1, message : "rolePemission Created", data : assignPermission})
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while create rolePermission"})
    }
}

const readRolePemission = async (req, res) => {
    try{
        const rolePemission = await rolePemissionModel.find()
        res.status(200).json({ status : 1, message : "Fetched data sucessfully", data : rolePemission})
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while fetch rolePermission" })
    }
}

// == one users particular read all permission ==
const readRolesAllPermission = async (req, res) => {
    try{
        const RoleId = req.params.id
        const role = await roleModel.find(RoleId)
        if(!role){
            return res.status(500).json({ status : 0, message : "role not found" })
        }

        const permission = await rolePemissionModel.findById(RoleId)
        res.status(200).json({ status : 1, message : "fetched role's All Permissions" })
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while fetch role's all permission" })
    }
}

const updateRolePemission = async(req, res) => {
    try{
        const rolePemissionId = req.params.id
        const { RoleId, PermissionId } = req.body
        
        const RolePer = await rolePemissionModel.findById(rolePemissionId)
        if(!checkRolePer){
            return res.status(400).json({ status : 0, message : "not found role has permission"})
        }

        if(!RoleId || !PermissionId){
            return res.status(400).json({ status : 0, message : "roleId & permissionId is required" })
        }

        const role = await roleModel.findById(RoleId)
        if(!role){
            return res.status(400).json({ status : 0, message : "role not found" })
        }

        const permission = await permissionModel.findById(PermissionId)
        if(!permission){
            return res.status(400).json({ status : 0, message : "permission not found" })
        }

        const updateData = {
            RoleId : req.body.RoleId || RolePer.RoleId,
            PermissionId : req.body.PermissionId || RolePer.PermissionId
        }

        const updateRolePermission = await rolePemissionModel.findByIdAndUpdate(
            rolePemissionId,
            updateData,
            { new : true }
        )

        res.status(200).json({ status : 1, message : "update role or permission", data : updateRolePermission })
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while updata rolePermission" })
    }
}

module.exports = { createRolePermission, readRolePemission, readRolesAllPermission, updateRolePemission }