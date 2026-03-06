const permissionModel = require('../model/permissionModel')

const seedPermission = async () => {
    try{

        const permissions = [
            // course
            { name : "course_create"},
            { name : "course_view"},
            { name : "course_view_self"},
            { name : "course_update"},
            { name : "course_delete"},

            // profile
            { name : "profile_update"},

            // tutor
            { name : "send_reapply_otp"},
            { name : "verify_reapply_otp"},
            { name : "tutor_reapply_profile"},
        ]

        for(const perm of permissions) {

            const exist = await permissionModel.findOne({ name : perm.name })

            if(!exist){
                await permissionModel.create(perm)
                console.log(`Created : ${perm.name}`);
            }
            else{
                console.log(`Already Exists : ${perm.name}`);
            }
        }
    } catch(err){
        console.log(err);
    }
}

module.exports = seedPermission 