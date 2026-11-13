const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const MonthClosing = sequelize.define('MonthClosing', {
    referenceMonth: {
        type: DataTypes.STRING(7),
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    totalPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    totalPending: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    totalsByCategory: {
        type: DataTypes.JSONB
    },
    closedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    indexes: [
        { unique: true, fields: ['FamilyId', 'referenceMonth'] }
    ]
})

module.exports = MonthClosing