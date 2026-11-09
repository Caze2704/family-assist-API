const {Family, User, Bill} = require('../models')

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
        
    }
}