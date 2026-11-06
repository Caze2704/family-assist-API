const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    memberStatus: {
        type: DataTypes.ENUM('admin', 'Adulto', 'Criança'),
        defaultValue: 'Adulto'
    }
})

module.exports = User