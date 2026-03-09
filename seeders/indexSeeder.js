require("dotenv").config();

const mongoose = require("mongoose");
const seedAdmin = require('./adminSeeder')
const seedRole = require('./roleSeeder')
const seedPermission = require('./permissionSeeder')


const runSeeder = async () => {
    try{
        
        await mongoose.connect(process.env.DB_URL)
        console.log("DB Connected to Seeder");
        
        await seedRole()
        console.log('seedRole');
        
        await seedAdmin()
        console.log('seedAdmin');
        

        await seedPermission()
        console.log('seedPermission');

        process.exit()

    } catch(err){
        console.log(err);
        process.exit()
    }
}

runSeeder()