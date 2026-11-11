const express = require('express')
const app = express()
const cors = require('cors')

// import routes

const FamilyRoutes = require('./routes/FamilyRoutes')
const UserRoutes = require('./routes/UserRoutes')
const TaskRoutes = require('./routes/TaskRoutes')
const BillRoutes = require('./routes/BillRoutes')
const MonthClosingRoutes = require('./routes/MonthClosingRoutes')
const EventRoutes = require('./routes/EventRoutes')

app.use(express.json())

app.use(cors())

// config routes

app.use('/family', FamilyRoutes)
app.use('/user', UserRoutes)
app.use('/task', TaskRoutes)
app.use('/bill', BillRoutes)
app.use('/month', MonthClosingRoutes)
app.use('/event', EventRoutes)

module.exports = app