const {sequelize, Family, User, Task} = require('../models')

module.exports = class TaskController{

    static async create(req, res){

        const { title: rawTitle, description, deadLine } = req.body || {}
        const title = String(rawTitle || '').trim()

        if(!title || !deadLine){
            return res.status(422).json({message: "Preencha todos os campos!"})
        }

        if(isNaN(Date.parse(deadLine))){
            return res.status(422).json({message: "Data inválida!"})
        }

        try {

            const exists = await Task.findOne({
                where: {title, FamilyId: req.user.familyId, completed: false}
            })

            if(exists){
                return res.status(422).json({message: "Tarefa já cadastrada!"})
            }

            const task = {
                title,
                description,
                deadLine,
                FamilyId: req.user.familyId
            }

            const newTask = await Task.create(task)

            return res.status(201).json({
                message: "Tarefa cadastrada com sucesso!",
                newTask 
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }
    }

}