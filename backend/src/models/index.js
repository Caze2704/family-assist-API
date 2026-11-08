const sequelize = require('../config/db')

const Family = require('./Familia')
const User = require('./User')
const Task = require('./Task')
const Event = require('./Event')
const Bill = require('./Bill')
const MonthClosing = require('./monthClosing')

Family.hasMany(User, { foreignKey: 'FamilyId' })
User.belongsTo(Family, { foreignKey: 'FamilyId' })

Family.hasMany(Task, { foreignKey: 'FamilyId' })
Task.belongsTo(Family, { foreignKey: 'FamilyId' })

Family.hasMany(Event, { foreignKey: 'FamilyId' })
Event.belongsTo(Family, { foreignKey: 'FamilyId' })

Family.hasMany(Bill, { foreignKey: 'FamilyId' })
Bill.belongsTo(Family, { foreignKey: 'FamilyId' })

Family.hasMany(MonthClosing, { foreignKey: 'FamilyId' })
MonthClosing.belongsTo(Family, { foreignKey: 'FamilyId' })

User.hasMany(Task, { foreignKey: 'ResponsibleId' })
Task.belongsTo(User, { as: 'responsible', foreignKey: 'ResponsibleId' })

User.hasMany(Event, { foreignKey: 'CreatedById' })
Event.belongsTo(User, { as: 'createdBy', foreignKey: 'CreatedById' })

User.hasMany(Bill, { foreignKey: 'PaidById' })
Bill.belongsTo(User, { as: 'paidBy', foreignKey: 'PaidById' })

User.hasMany(MonthClosing, { foreignKey: 'ClosedById' })
MonthClosing.belongsTo(User, { as: 'closedBy', foreignKey: 'ClosedById' })

module.exports = { sequelize, Family, User, Task, Event, Bill, MonthClosing }