const { Op } = require('sequelize')
const { Event } = require('../models')

const parseEventDate = require('../helpers/parseEventDate')

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/
const DAY_MS = 24 * 60 * 60 * 1000

function parseRangeDate(value, isEnd){
    if(typeof value !== 'string') return null

    if(DATE_ONLY.test(value)){
        const time = Date.parse(value)
        if(isNaN(time)) return null
        return isEnd ? time + DAY_MS - 1 : time
    }

    return parseEventDate(value, false)
}

function isValidId(id){
    return /^\d+$/.test(id) && Number(id) <= 2147483647
}

module.exports = class EventController{

    static async create(req, res){

        const { title: rawTitle, description: rawDescription, startDate, endDate, allDay, local: rawLocal } = req.body || {}

        const title = String(rawTitle || '').trim()
        const description = rawDescription === undefined ? null : String(rawDescription).trim() || null
        const local = rawLocal === undefined ? null : String(rawLocal).trim() || null

        if(!title || !startDate){
            return res.status(422).json({message: "Preencha todos os campos obrigatórios!"})
        }

        if(allDay !== undefined && typeof allDay !== 'boolean'){
            return res.status(422).json({message: "Status de dia inteiro inválido!"})
        }

        const isAllDay = allDay === true

        const start = parseEventDate(startDate, isAllDay)
        if(start === null){
            return res.status(422).json({message: isAllDay
                ? "Data inválida! Use AAAA-MM-DD"
                : "Data e hora inválidas! Use o formato AAAA-MM-DDTHH:MM:SS-03:00"})
        }

        if(endDate !== undefined && endDate !== null){
            const end = parseEventDate(endDate, isAllDay)
            if(end === null){
                return res.status(422).json({message: "Data de fim inválida!"})
            }
            if(end < start){
                return res.status(422).json({message: "A data de final de evento não pode ser anterior à data de início!"})
            }
        }

        try {

            const event = {
                title,
                description,
                startDate,
                endDate,
                allDay,
                local,
                FamilyId: req.user.familyId,
                CreatedById: req.user.id
            }

            const newEvent = await Event.create(event)

            return res.status(201).json({
                message: "Evento registrado com sucesso!",
                newEvent
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }
    }

    static async list(req, res){

        const { from, to } = req.query

        const where = { FamilyId: req.user.familyId }

        let fromTime = null
        let toTime = null

        if(from !== undefined){
            fromTime = parseRangeDate(from, false)
            if(fromTime === null){
                return res.status(422).json({message: "Filtro 'from' inválido! Use AAAA-MM-DD"})
            }
        }

        if(to !== undefined){
            toTime = parseRangeDate(to, true)
            if(toTime === null){
                return res.status(422).json({message: "Filtro 'to' inválido! Use AAAA-MM-DD"})
            }
        }

        if(fromTime !== null && toTime !== null && toTime < fromTime){
            return res.status(422).json({message: "O filtro 'to' não pode ser anterior ao 'from'!"})
        }

        if(fromTime !== null || toTime !== null){
            where.startDate = {}
            if(fromTime !== null) where.startDate[Op.gte] = new Date(fromTime)
            if(toTime !== null) where.startDate[Op.lte] = new Date(toTime)
        }

        try {

            const events = await Event.findAll({
                where,
                order: [['startDate', 'ASC']]
            })

            return res.status(200).json({
                total: events.length,
                events
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }
    }

    static async update(req, res){

        const { id } = req.params

        if(!isValidId(id)){
            return res.status(404).json({message: "Evento não encontrado!"})
        }

        const { title, description, startDate, endDate, allDay, local } = req.body || {}

        if(allDay !== undefined && typeof allDay !== 'boolean'){
            return res.status(422).json({message: "Status de dia inteiro inválido!"})
        }

        try {

            const event = await Event.findOne({
                where: { id, FamilyId: req.user.familyId }
            })

            if(!event){
                return res.status(404).json({message: "Evento não encontrado!"})
            }

            const data = {}
            const finalAllDay = allDay !== undefined ? allDay : event.allDay

            if(allDay !== undefined && allDay !== event.allDay){
                if(startDate === undefined){
                    return res.status(422).json({message: "Ao mudar entre dia inteiro e horário, envie também a data de início!"})
                }
                if(event.endDate && endDate === undefined){
                    return res.status(422).json({message: "Ao mudar entre dia inteiro e horário, envie também a data de fim (ou null)!"})
                }
                data.allDay = allDay
            }

            if(title !== undefined){
                const newTitle = String(title || '').trim()
                if(!newTitle){
                    return res.status(422).json({message: "Título inválido!"})
                }
                data.title = newTitle
            }

            if(description !== undefined){
                data.description = description === null ? null : String(description).trim() || null
            }

            if(local !== undefined){
                data.local = local === null ? null : String(local).trim() || null
            }

            let startTime = event.startDate.getTime()
            let endTime = event.endDate ? event.endDate.getTime() : null

            if(startDate !== undefined){
                const parsed = parseEventDate(startDate, finalAllDay)
                if(parsed === null){
                    return res.status(422).json({message: finalAllDay
                        ? "Data inválida! Use AAAA-MM-DD"
                        : "Data e hora inválidas! Use o formato AAAA-MM-DDTHH:MM:SS-03:00"})
                }
                data.startDate = startDate
                startTime = parsed
            }

            if(endDate !== undefined){
                if(endDate === null){
                    data.endDate = null
                    endTime = null
                }else{
                    const parsed = parseEventDate(endDate, finalAllDay)
                    if(parsed === null){
                        return res.status(422).json({message: "Data de fim inválida!"})
                    }
                    data.endDate = endDate
                    endTime = parsed
                }
            }

            if(endTime !== null && endTime < startTime){
                return res.status(422).json({message: "A data de final de evento não pode ser anterior à data de início!"})
            }

            if(Object.keys(data).length === 0){
                return res.status(422).json({message: "Nenhum dado para atualizar!"})
            }

            await event.update(data)

            return res.status(200).json({
                message: "Evento atualizado com sucesso!",
                event
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }
    }

    static async delete(req, res){

        const { id } = req.params

        if(!isValidId(id)){
            return res.status(404).json({message: "Evento não encontrado!"})
        }

        try {

            const event = await Event.findOne({
                where: { id, FamilyId: req.user.familyId }
            })

            if(!event){
                return res.status(404).json({message: "Evento não encontrado!"})
            }

            await event.destroy()

            return res.status(200).json({message: "Evento excluído com sucesso!"})

        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Não foi possível completar a solicitação"})
        }
    }
}