const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/
const DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/

function parseEventDate(value, allDay){
    const format = allDay ? DATE_ONLY : DATE_TIME
    if(typeof value !== 'string' || !format.test(value)) return null

    const time = Date.parse(value)
    return isNaN(time) ? null : time
}

module.exports = parseEventDate