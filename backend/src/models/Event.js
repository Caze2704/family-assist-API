const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Event = sequelize.define('Event', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descritpion: {
        type: DataTypes.TEXT,
    },
    startData: {
        type: DataTypes.DATE,
        allowNull: false
    },
    deadLine: {
        type: DataTypes.DATEONLY
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