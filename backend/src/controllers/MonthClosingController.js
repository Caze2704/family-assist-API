const { MonthClosing, User, Bill } = require('../models')

const isMonthClosed = require('../helpers/isMonthClosed')

module.exports = class MonthClosingController{

    static async closeMonth(req, res){
        const { referenceMonth } = req.body || {}
        
        if(!referenceMonth){
            return res.status(422).json({message: "Preencha o campo!"})
        }

        if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(referenceMonth)){
            return res.status(422).json({message: "Mês inválido! Use o formato AAAA-MM"})
        }

        try {
            
            if(await isMonthClosed(req.user.familyId, referenceMonth)){
                return res.status(409).json({message: "O mês de destino já está fechado!"})
            }

            const bills = await Bill.findAll({
                where: {FamilyId: req.user.familyId, referenceMonth}
            })

            if(bills.length <= 0){
                return res.status(422).json({message: "Nenhuma conta registrada para esse mês!"})
            }

            let totalCents = 0
            let paidCents = 0
            const categoryCents = {}

            for(const bill of bills){
                const cents = Math.round(Number(bill.amount) * 100)

                totalCents += cents
                if(bill.status === 'paga') paidCents += cents

                categoryCents[bill.category] = (categoryCents[bill.category] || 0) + cents
            }

            const totalsByCategory = {}
            for(const category in categoryCents){
                totalsByCategory[category] = categoryCents[category] / 100
            }

            const totalAmount = totalCents / 100
            const totalPaid = paidCents / 100
            const totalPending = (totalCents - paidCents) / 100

            const closing = await MonthClosing.create({
                referenceMonth,
                totalAmount,
                totalPaid,
                totalPending,
                totalsByCategory,
                FamilyId: req.user.familyId,
                ClosedById: req.user.id
            })

            return res.status(201).json({
                message: "Mês fechado com sucesso!",
                closing
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }
    }

    static async list(req, res){

        try {
            
            const months = await MonthClosing.findAll({
                where: {FamilyId: req.user.familyId},
                order: [['referenceMonth', 'DESC']]
            })

            if(months.length <= 0 ){
                return res.status(422).json({message: "Nenhum mês fechado!"})
            }

            return res.status(200).json({
                total: months.length,
                months
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }
    }

    static async delete(req, res){

        const {id} = req.params

        try {
            
            const month = await MonthClosing.findOne({
                where: {id, FamilyId: req.user.familyId}
            })

            if(!month){
                return res.status(404).json({message: "Mês não encontrado!"})
            }

            await month.destroy()

            return res.status(200).json({message: "Mês reaberto com sucesso!"})

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }
    }

}