require('dotenv').config()
const jwt = require('jsonwebtoken')

const createToken = function(user) {
    const secret = process.env.SECRET_TOKEN

    if (!secret) {
        throw new Error("SECRET_TOKEN não está definido no arquivo .env")
    }

    return jwt.sign({
        name: user.name,
        id: user.id,
        familyId: user.FamilyId || user.familyId,
        memberStatus: user.memberStatus 
    }, secret, {
        expiresIn: '7d'
    })
}

module.exports = createToken