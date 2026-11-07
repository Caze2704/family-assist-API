const bcrypt = require('bcrypt')
const { sequelize, Family, User } = require('../models')

const createToken = require('../helpers/createToken')

module.exports = class FamilyController{

        static async register(req, res){

            const { familyName, name, email, password } = req.body || {}

            if(!familyName || !name || !email || !password){
                return res.status(422).json({message: "Preencha todos os campos!"})
            }
            
            console.log('1. register chamado', req.body)

            try {
                const emailExists = await User.findOne({where: {email}})

                if(emailExists){
                    return res.status(422).json({ message: "Este e-mail já está em uso!"})
                }

                console.log('2. findOne ok')

                const salt = await bcrypt.genSalt(12)
                const passwordHash = await bcrypt.hash(password, salt)

                const user = await sequelize.transaction(async (t) => {
                    const family = await Family.create({name: familyName}, {transaction: t})

                    return await User.create({
                        name,
                        email,
                        password: passwordHash,
                        memberStatus: 'admin',
                        FamilyId: family.id
                    }, {transaction: t})
                
                })

                console.log('4. transação ok')

                const token = createToken(user)

                return res.status(201).json({
                    message: "Família cadastrada com sucesso!",
                    token,
                    FamilyId: user.FamilyId
                })

            } catch (err) {
                console.log(err)
                return res.status(500).json({message: "Não foi possível completar a solicitação."})
            }
        }

    static async getMyFamily(req, res){

        try {
            const family = await Family.findByPk(req.user.FamilyId, {
                include: {model: User, attributes: ['id', 'name', 'email', 'memberStatus']}
            })

            if(!family){
                return res.status(404).json({message: "Família não encontrada!"})
            }

            res.status(200).json({ family })

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação."})
        }
    }

}