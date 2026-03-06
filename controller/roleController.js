const roleModel = require('../model/roleModel')
const rolePemissionModel = require('../model/rolePermissionModel')

const createRole = async(req, res) => {
    try{
        const { name, description } = req.body

        // == role name is required ==
        if(!name){
            return res.status(400).json({ status : 0, message : "name is required" })
        }

        const existRole = await roleModel.findOne({ name })
        if(existRole){
            return res.status(400).json({ status : 0, message : "role already exist" })
        }

        const role = await roleModel.create({
            name,
            description
        })

        res.status(201).json({ status : 1, message : "Role Created", data : role })

    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while create role", error : err})
    }
}

// == read all roles users ==
const readAllRole = async(req, res) => {
    try{    
        const roles = await roleModel.find()
        res.status(200).json({ status : 1, message : "Read All Roles", data : roles })
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : 'error while read role', error : err})
    }
}

// == read role by name ==
const readRoleByName = async (req, res) => {
    try{
        const { role } = req.query
        
        const roleData = await roleModel.findOne({ name : role })
        if(!roleData){
            return res.status(404).json({ status : 0, message : "role not found" })
        }

        res.stataus(200).json({ status : 1, message : "Role fetched successfully", data : roleData})

    } catch(err){
        console.log(err);
        res.stataus(500).json({ status : 0, message : "error while read role by name", error : err})
    }
}


const updateRole = async(req, res) => {
    try{
        const roleId = req.params.id

        
        const checkRole = await roleModel.findById(roleId)
        if(!checkRole){
            return res.status(400).json({ status : 0, message : "role not found" })
        }
        
        // == role name required ==
        if(!name){
            return res.status(400).json({ status : 0, message : "role name is required" })
        }

        // == check duplicate role name ==
        const existRole = await roleModel.findOne({ name })
        if(existRole){
            return res.status(400).json({ status : 0, message : "this name already exist" })
        }

        const updateData = {
            name : req.body.name || name,
            description : req.body.description || description
        }

        const updateRole = await roleModel.findByIdAndUpdate(
            roleId,
            updateData,
            { new : true }
        )

        res.status(200).json({ status : 1, message : "Update role ", data : updateRole })

    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while update role" })
    }
}

const deleteRole = async(req, res) => {
    try{
        const roleId = req.params.id

        const checkRole = await roleModel.findById(roleId)
        if(!checkRole){
            return res.status(400).json({ status : 0, message : "role not found"})
        }

        const deleteRole = await roleModel.findByIdAndDelete(roleId)
        // delete role's all permission
        if(deleteRole){
            const deleteRolesPermission = await rolePemissionModel.deleteMany({
                RoleId : roleId
            })
        }

        res.status(200).json({ status : 1, message : "Delete rtole & role's Permission" })

    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while delete role" })
    }
}

module.exports = { createRole, readRoleByName, readAllRole, updateRole, deleteRole }