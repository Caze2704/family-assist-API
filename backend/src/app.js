const express = require('express')
const app = express()

// import routes

const FamilyRoutes = require('./routes/FamilyRoutes')
const UserRoutes = require('./routes/UserRoutes')

app.use(express.json())

// config routes

app.use('/family', FamilyRoutes)
app.use('/user', UserRoutes)

module.exports = app