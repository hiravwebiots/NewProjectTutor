const express = require('express')
const routes = express()

routes.get('/', (req, res) => {
    const student = {
        name : "test",
        standard : "beginner",
        address : "Surat",
        
    }
    res.render('demo', { student } ) 
})

module.exports = routes