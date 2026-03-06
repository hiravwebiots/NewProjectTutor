const bcrypt = require('bcrypt')
const userModel = require('../model/userModel')
const roleModel = require('../model/roleModel')

const seedAdmin = async () => {
    try{
        // // ==== Find Admin Role ==== 
        const adminRole = await roleModel.findOne({ name : "admin" })
        // if(!adminRole){
        //     console.log('Admin role not found. Please run role seeder first');
        //     return;
        // }

        // ==== Check Existing Admin ====
        let admin = await userModel.findOne({ email : process.env.ADMIN_EMAIL })
        if(!admin){
            const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)

            admin = await userModel.create({
                name : "Admin 1",
                email : process.env.ADMIN_EMAIL,
                password : hashPassword,
                phone : 7069146434,
                role : adminRole.id,
                approvalStatus : "approved"
            })
            console.log('Default Admin Created');
        } else{
            console.log('admin already exist');
        }
    } catch(err){
        console.log(err);
    }
}

module.exports = seedAdmin