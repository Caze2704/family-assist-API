const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Event = sequelize.define('Event', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
    },
    allDay: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    local: {
        type: DataTypes.STRING,
    }

})

module.exports = Event