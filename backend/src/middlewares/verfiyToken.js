require('dotenv').config()
const jwt = require('jsonwebtoken')

const verifyToken = async function(req, res, next){

    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({message: "Acesso negado!"})
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_TOKEN)
        req.user = verified

        next()
    } catch (err) {
        return res.status(401).json({message: "Token inválido!"})
    }

}

module.exports = verifyToken