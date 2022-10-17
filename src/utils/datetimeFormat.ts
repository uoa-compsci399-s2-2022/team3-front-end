import dayjs from "dayjs";

export function datetimeFormat(datetime) {
    if (dayjs(datetime).isValid()) {
        return dayjs(datetime).format('DD-MM-YYYY HH:mm:ss')
    } else {
        return datetime
    }
}


export function dateFormat(date) {
    if (dayjs(date).isValid()) {
        return dayjs(date).format('DD-MM-YYYY')
    } else {
        return date
    }
}
