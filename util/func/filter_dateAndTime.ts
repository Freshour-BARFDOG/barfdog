type DateAndTime = { date: string, time: string };
export function filter_dateAndTime(dateTime:string): null | DateAndTime {
    if (!dateTime || typeof dateTime !== "string") return;
    const [date, time] = dateTime.split(" ");
    return {
        date: date,
        time: time
    }
}
