const bcrypt = require('bcrypt')
const { sequelize, Family, User } = require('../models')

const getToken = require('../helpers/getToken')
const getUserByToken = require('../helpers/getUserByToken')
const createToken = require('../helpers/createToken')

module.exports = class UserController{
    static async login(req, res){

        const { email: rawEmail, password } = req.body || {}
        const email = String(rawEmail || '').trim().toLowerCase() 

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

    static async createMember(req, res){

        const {name, email: rawEmail, password, memberStatus} = req.body || {}

        const email = String(rawEmail || '').trim().toLowerCase()

        if(!name || !email || !password || !memberStatus){
            return res.status(422).json({message: "Preencha todos os campos!"})
        }

        if(!['adult', 'child', 'admin'].includes(memberStatus)){
            return res.status(422).json({message: "Dados inválidos!"})
        }

        try {

            const exists = await User.findOne({where: {email}})

            if(exists){
                return res.status(409).json({message: "E-mail já cadastrado"})
            }
    
            if(!req.user.familyId){
                return res.status(404).json({message: "Família não encontrada"})
            }

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            const newUser = {
                name,
                email,
                password: passwordHash,
                memberStatus,
                FamilyId: req.user.familyId
            }

            const userCreated = await User.create(newUser)

            res.status(201).json({
                message: "Usuário cadastrado com sucesso!",
                user: {
                    id: userCreated.id,
                    name: userCreated.name,
                    email: userCreated.email,
                    memberStatus: userCreated.memberStatus,
                }
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação."})
        }
    }

    static async listMembers(req, res){
        try {
            const members = await User.findAll({
                where: {FamilyId: req.user.familyId},
                attributes: ['id', 'name', 'email', 'memberStatus'],
                order: [['name', 'ASC']]
            })

            return res.json({members})
        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação."})
        }
    }

    static async updateMember(req, res){

        const {id} = req.params
        const {name, email: rawEmail, memberStatus} = req.body || {}

        try {
            
            const member = await User.findOne({
                where: {id, FamilyId: req.user.familyId}
            })

            if(!member){
                return res.status(404).json({message: "Usuário não encontrado!"})
            }

            const data = {}

            if(name !== undefined){
                const newName = String(name).trim()
                if(!newName){
                    return res.status(422).json({message: "Nome inválido!"})
                }
                data.name = newName
            }

            if(rawEmail !== undefined){
                const email = String(rawEmail || '').trim().toLowerCase()
                if(!email){
                    return res.status(422).json({message: "E-mail inválido!"})
                }
                if(email !== member.email){
                    const exists = await User.findOne({where: {email}})
                    if(exists){
                        return res.status(409).json({message: "E-mail já cadastrado!"})
                    }
                }
                data.email = email
            }

            if(memberStatus !== undefined){
                if(!['adult', 'child', 'admin'].includes(memberStatus)){
                    return res.status(422).json({message: "Dados inválidos!"})
                }
                if(member.memberStatus === 'admin' && memberStatus !== 'admin'){
                    const admins = await User.count({
                        where: { FamilyId: req.user.familyId, memberStatus: 'admin'}
                    })
                    if(admins.length <= 1){
                        return res.status(422).json({message: "A família precisa ter pelo menos um adminstrador!"})
                    }
                }
                data.memberStatus = memberStatus
            }

            if(Object.keys(data).length === 0){
                return res.status(422).json({message: "Nenhum dado para atualizar!"})
            }

            await member.update(data)

            return res.status(200).json({
                message: "Membro atualizado com sucesso!",
                user: {
                    id: member.id,
                    name: member.name,
                    email: member.email,
                    memberStatus: member.memberStatus
                }
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({message: "Não foi possível completar a solicitação"})
        }
    }

    static async deleteMember(req, res){

        const {id} = req.params

        try {
            const user = await User.findOne({
                where: { id, FamilyId: req.user.familyId}
            })

            if(!user){
                return res.status(404).json({message: "Usuário não encontrado"})
            }

            if(user.memberStatus === 'admin'){
                const admins = await User.count({
                    where: { FamilyId: req.user.familyId, memberStatus: 'admin'}
                })
                if(admins <= 1){
                    return res.status(422).json({message: "A família precisa ter pelo menos 1 administrador"})
                }
            }

            await user.destroy()

            return res.status(200).json({message: "Usuário removido com sucesso!"})

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }
    }
}