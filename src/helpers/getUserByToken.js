require('dotenv').config()
const jwt = require('jsonwebtoken')

const {User} = require('../models')

const getUserByToken = async (token) => {
    if(!token){
        return res.status(401).json({message: "Acesso negado!"})
    }

    const decoded = jwt.verify(token, process.env.SECRET_TOKEN)

    const userId = decoded.id

    const user = await User.findByPk({userId})

    return user
}

module.exports = getUserByToken