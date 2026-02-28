require("dotenv").config();

const mongoose = require("mongoose");
const seedAdmin = require('./adminSeeder')

const runSeeder = async () => {
    try{

        await mongoose.connect(process.env.DB_URL)
        console.log("DB Connected to Seeder");
        

        await seedAdmin()
        console.log('seedAdmin');
        process.exit()


    } catch(err){   
        console.log(err);
        process.exit()
    }
}

runSeeder()