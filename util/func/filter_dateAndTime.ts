type DateAndTime = { date: string, time: string };
export function filter_dateAndTime(dateTime:string): null | DateAndTime {
    const defaultResult = {
        date: "",
        time: ""
    }
    if (!dateTime || typeof dateTime !== "string") return defaultResult;
    const [date, time] = dateTime.split(" ");
    return {
        date: date,
        time: time
    }
}
