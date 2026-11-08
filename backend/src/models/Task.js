const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }, 
    deadLine: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }

})

module.exports = Task