const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Bill = sequelize.define('Bill', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('moradia', 'servicos', 'educacao', 'saude', 'transporte', 'alimentacao', 'outros'),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    dueDate: {
        type: DataTypes.DATEONLY,
    },
    referenceMonth: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('pendente', 'paga'),
        defaultValue: 'pendente'
    },
    paidAt: {
        type: DataTypes.DATE
    }
})

module.exports = Bill