// helper function for "role has permission"  table to check it's exist or  not and no duplicate 
const rolePemissionModel = require('../models/rolePermissionModel') 

const checkRolePermission = (requiredPermission) => {          // tutor_reapply_profile
    return async (req, res, next) => {
        try{
            const roleType = req.user.roleId.type

            if(roleType === 'admin'){
                console.log("Admin Login → Full Access Granted");
                return next()
            }

            // ===== student and tutor check for Access ====
            const roleId = req.user.roleId.id

            if(!roleId){
                return res.status(403).json({ status : 0, message : "role not found" })
            }

            // === get all permission for this role ===
            const rolePermission = await rolePemissionModel.find({ RoleId : roleId }).populate('PermissionId')


            // ==== extract permission name === 
            const permissions = rolePermission.map(rp => rp.PermissionId.name)

            if(!permissions.includes(requiredPermission)){
                return res.status(403).json({ status : 0, message : "Access Denied, Permission Required" })
            }
            next()

        } catch(err){
            console.log(err);
            res.status(500).json({ status : 0, message : "error while checkRolePermission" })
        }
    }
}

module.exports = checkRolePermission