const roleModel = require('../models/roleModel')

const seedRole = async () => {
    try{
        const role = {
            name : 'admin',
            type : 'admin'
        }

        const exist = await roleModel.findOne({ name : role.name })

        if(!exist){
            await roleModel.create(role)
        } else{
            console.log(`Already ${role.name} role exist`);
        }

    } catch(err){   
        console.log(err);
    }
}

module.exports = seedRole