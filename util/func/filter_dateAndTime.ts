type DateAndTime = { date: string, time: string };
export function filter_dateAndTime(dateTime:string): null | DateAndTime {
    const defaultResult = {
        date: "",
        time: ""
    }
    if (!dateTime || typeof dateTime !== "string") return defaultResult;
    const apiServerSeperator:string = "T";
    const seperator:string = " "; // T를 공백으로 변경
    const [date, time] = filterDateTimeSeperator(dateTime, apiServerSeperator, seperator).split(seperator);

    return {
        date: date,
        time: filterTime(time, "sec")
    }
}



type FilterTimeUnit = "sec" | "min";
export const filterTime = (time:string, filteringUnit:FilterTimeUnit):string => {
    if(!time || !filteringUnit) return time;
    let result;
    const timeSeperator = ":";
    const timeUnits = time.split(timeSeperator);
    if (filteringUnit === "sec") {
        const hasSec = timeUnits.length === 3;
        result = hasSec ? timeUnits.filter((u, index) => index !== 2).join(timeSeperator) : time;
    }

    if (filteringUnit === "min") {
        const hasMin = timeUnits.length === 2;
        result = hasMin ? timeUnits.filter((u, index) => index === 0).join(timeSeperator) : time;
    }
    return result;
};


export const filterDateTimeSeperator = (dateTime:string, seperator:string, toBeString:string) => {
    if (dateTime.indexOf(seperator)) {
        dateTime = dateTime.replace(seperator, toBeString)
    }
    return dateTime;

};
