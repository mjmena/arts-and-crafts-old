export const Days = {
    MONDAY: {
        name: 'MONDAY',
        description: 'Monday',
        value: 0
    },
    TUESDAY: {
        name: 'TUESDAY',
        description: 'Tuesday',
        value: 1
    },
    WEDNESDAY: {
        name: 'WEDNESDAY',
        description: 'Wednesday',
        value: 2
    },
    THURSDAY: {
        name: 'THURSDAY',
        description: 'Thursday',
        value: 3
    },
    FRIDAY: {
        name: 'FRIDAY',
        description: 'Friday',
        value: 4
    },
    SATURDAY: {
        name: 'SATURDAY',
        description: 'Saturday',
        value: 5
    },
    SUNDAY: {
        name: 'SUNDAY',
        description: 'Sunday',
        value: 6
    }
}

export const ValueToDescription = (enums, value) =>{
    return enums[Object.keys(enums)[value]].description
}