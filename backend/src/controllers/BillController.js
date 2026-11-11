const {Bill} = require('../models')
const isMonthClosed = require('../helpers/isMonthClosed')

module.exports = class BillController{

    static async create(req, res){

        const { name: rawName, category, amount, dueDate, referenceMonth } = req.body || {}
        const name = String(rawName || '').trim()
        const value = Number(amount)

        // validations

        if(!name || !category || !amount || !dueDate || !referenceMonth){
            return res.status(422).json({message: "Preencha todos os campos"})
        }

        if(!Number.isFinite(value) || value <= 0){
            return res.status(422).json({message: "Insira um valor válido!"})
        }

        if(isNaN(Date.parse(dueDate))){
            return res.status(422).json({message: "Insira uma data válida!"})
        }

        if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(referenceMonth)){
            return res.status(422).json({message: "Mês inválido! Use o formato AAAA-MM"})
        }

        if(!['moradia', 'servicos', 'educacao', 'saude', 'transporte', 'alimentacao', 'outros'].includes(category)){
            return res.status(422).json({message: "Categoria inválida!"})
        }

        try {
            
            if(await isMonthClosed(req.user.familyId, referenceMonth)){
                return res.status(409).json({message: "Este mês está fechado!"})
            }
            
            const bill = {
                name, 
                category,
                amount: Math.round(value * 100) / 100,
                dueDate,
                referenceMonth,
                FamilyId: req.user.familyId
            }

            const newBill = await Bill.create(bill)

            return res.status(201).json({
                message: "Conta cadastrada com sucesso!",
                newBill
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }

    }

    static async list(req, res){

        const { month } = req.query

        if(month !== undefined && !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)){
            return res.status(422).json({message: "Mês inválido! Use o formato AAAA-MM"})
        }

        const where = { FamilyId: req.user.familyId }
        if(month) where.referenceMonth = month

        try {

            const bills = await Bill.findAll({
                where,
                order: [['dueDate', 'ASC']]
            })

            let total = 0
            let paid = 0

            for(const bill of bills){
                const value = Number(bill.amount)
                total += value
                if(bill.status === 'paga') paid += value
            }

            return res.status(200).json({
                count: bills.length,
                summary: {
                    total: Math.round(total * 100) / 100,
                    paid: Math.round(paid * 100) / 100,
                    pending: Math.round((total - paid) * 100) / 100
                },
                bills
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }
    }

    static async update(req, res){
        
        const {id} = req.params

        const { name: rawName, category, amount, dueDate, referenceMonth, paidAt } = req.body || {}

        const data = {}

        if(!/^\d+$/.test(id) || Number(id) > 2147483647){
            return res.status(404).json({message: "Id inválido!"})
        }

        try {            
            
            const bill = await Bill.findOne({
                where: {id, FamilyId: req.user.familyId}
            })

            if(!bill){
                return res.status(404).json({message: "Conta não encontrada."})
            }

            if(await isMonthClosed(req.user.familyId, bill.referenceMonth)){
                return res.status(409).json({message: "Este mês está fechado!"})
            }

            if(rawName !== undefined){
                const name = String(rawName || '').trim()
                if(!name){
                    return res.status(422).json({message: "Nome inválido!"})
                }
                data.name = name
            }

            if(category !== undefined){
                if(!['moradia', 'servicos', 'educacao', 'saude', 'transporte', 'alimentacao', 'outros'].includes(category)){
                    return res.status(422).json({message: "Categoria inválida!"})
                }
                data.category = category
            }

            if(amount !== undefined){
                const value = Number(amount)
                if(!Number.isFinite(value) || value <= 0){
                    return res.status(422).json({message: "Insira um valor válido!"})
                }
                data.amount = Math.round(value * 100) / 100
            }

            if(dueDate !== undefined){
                if(isNaN(Date.parse(dueDate)) || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)){
                    return res.status(422).json({message: "Insira uma data válida! (YYYY-MM-DD)"})
                }
                data.dueDate = dueDate
            }

            if(referenceMonth !== undefined){
                if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(referenceMonth)){
                    return res.status(422).json({message: "Mês inválido! Use o formato AAAA-MM"})
                }

                if(await isMonthClosed(req.user.familyId, referenceMonth)){
                    return res.status(409).json({message: "O mês de destino está fechado!"})
                }

                data.referenceMonth = referenceMonth
            }

            if(paidAt !== undefined){
                if(paidAt === null){
                    data.paidAt = null
                    data.status = 'pendente'
                    data.PaidById = null
                }else{
                    if(isNaN(Date.parse(paidAt)) || !/^\d{4}-\d{2}-\d{2}$/.test(paidAt)){
                        return res.status(422).json({message: "Insira uma data válida! (YYYY-MM-DD)"})
                    }

                    data.paidAt = paidAt
                    data.status = 'paga'
                    data.PaidById = req.user.id
                }
            }

            if(Object.keys(data).length === 0){
                return res.status(422).json({message: "Nenhum dado para atualizar!"})
            }

            await bill.update(data)

            return res.status(200).json({
                message: "Conta atualizada com sucesso!",
                bill
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }
    }

    static async delete(req, res){

        const {id} = req.params

        if(!/^\d+$/.test(id) || Number(id) > 2147483647){
            return res.status(404).json({message: "Id inválido!"})
        }
        
        try {
            
            const bill = await Bill.findOne({
                where: {id, FamilyId: req.user.familyId}
            })

            if(!bill){
                return res.status(404).json({message: "Conta não encontrada!"})
            }

            if(await isMonthClosed(req.user.familyId, bill.referenceMonth)){
                return res.status(409).json({message: "Este mês está fechado!"})
            }

            await bill.destroy()

            return res.status(200).json({message: "Conta excluída com sucesso!"})
        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }
    }
}