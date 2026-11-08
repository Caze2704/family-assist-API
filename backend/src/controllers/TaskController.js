const {sequelize, Family, User, Task} = require('../models')

module.exports = class TaskController{

    static async list(req, res){

        const { completed } = req.query

        const where = { FamilyId: req.user.familyId}

        if(completed !== undefined && !['true', 'false'].includes(completed)){
            return res.status(422).json({message: "O filtro 'completed' deve ser 'true' ou 'false'"})
        }

        if(completed === 'true') where.completed = true
        if(completed === 'false') where.completed = false

        try {
            
            const tasks = await Task.findAll({
                where,
                order: [['completed', 'ASC'], ['deadLine', 'ASC']]
            })

            return res.status(200).json({
                total: tasks.length,
                tasks
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }

    }

    static async create(req, res){

        const { title: rawTitle, description, deadLine, responsibleId } = req.body || {}
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

            if(responsibleId !== undefined && responsibleId !== null){
                const member = await User.findOne({
                    where: { id: responsibleId, FamilyId: req.user.familyId }
                })

                if(!member){
                    return res.status(422).json({message: "Responsável inválido!"})
                }
            }

            const task = {
                title,
                description,
                deadLine,
                FamilyId: req.user.familyId,
                ResponsibleId: responsibleId || null
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

    static async update(req, res){

        const {id} = req.params

        const { title , description, deadLine, completed, responsibleId } = req.body || {}

        if(req.user.memberStatus === 'child'){
            const onlyCompleted = Object.keys(req.body).every(key => key === 'completed')
            if(!onlyCompleted){
                return res.status(422).json({message: "Você só pode marcar tarefas como concluídas!"})
            }
        }

        try {
            const task = await Task.findOne({
                where: {id, FamilyId: req.user.familyId}
            })

            if(!task){
                return res.status(404).json({message: "Tarefa não encontrada"})
            }

            const data = {}

            // validations

            if(title !== undefined){
                const newTitle = String(title || '').trim()
                if(!newTitle){
                    return res.status(422).json({message: "Título inválido"})
                }
                const exists = await Task.findOne({
                    where: {
                        title: newTitle,
                        FamilyId: req.user.familyId,
                        completed: false
                    }
                })

                if(exists){
                    return res.status(422).json({message: "Tarefa já cadastrada!"})
                }

                data.title = newTitle
            }

            if(description !== undefined){
                data.description = String(description || '').trim()
            }

            if(deadLine !== undefined){
                if(isNaN(Date.parse(deadLine))){
                    return res.status(422).json({message: "Data inválida!"})
                }
                data.deadLine = deadLine
            }

            if(completed !== undefined){
                if(typeof completed !== 'boolean'){
                    return res.status(422).json({message: "Não foi possível atualizar o status da tarefa."})
                }    
                data.completed = completed
            }

            if(responsibleId !== undefined){
                if(responsibleId === null){
                    data.ResponsibleId = null
                }else{
                    const user = await User.findOne({
                        where: {id: responsibleId, FamilyId: req.user.familyId}
                    })
                    if(!user){
                        return res.status(404).json({message: "Usuário não encontrado"})
                    }
                    data.responsibleId = user.id    
                }
            }

            if(Object.keys(data).length === 0){
                return res.status(422).json({message: "Nenhum dado para atualizar!"})
            }

            // update

            await task.update(data)

            return res.status(200).json({
                message: "Tarefa atualizada com sucesso!",
                task
            })


        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }

    }

    static async delete(req, res){

    }

}