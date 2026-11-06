const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Family = sequelize.define('Family', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Family