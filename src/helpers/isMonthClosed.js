const MonthClosing = require('../models/MonthClosing')

async function isMonthClosed(familyId, month){

    const closing = await MonthClosing.findOne({
        where: {referenceMonth:month, FamilyId: familyId}
    })

    return closing !== null
}

module.exports = isMonthClosed