const bcrypt = require('bcrypt')
const { sequelize, Family, User } = require('../models')

const getToken = require('../helpers/getToken')
const getUserByToken = require('../helpers/getUserByToken')
const createToken = require('../helpers/createToken')

module.exports = class UserController{
    static async login(req, res){

        const { email, password } = req.body || '' 

        if(!email || !password){
            return res.status(422).json({message: "Preencha todos os campos!"})
        }

        try {
            const user = await User.findOne({where: {email}})

            if(!user){
                return res.status(422).json({message: "E-mail e/ou senha incorretos!"})
            }

            const checkPassword = await bcrypt.compare(password, user.password)

            if(!checkPassword){
                return res.status(422).json({message: "E-mail e/ou senha incorretos!"})
            }

            const token = createToken(user)

            return res.status(200).json({
                message: "Você está autenticado!",
                token,
                familyId: user.FamilyId
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação."})
        }

    }
}