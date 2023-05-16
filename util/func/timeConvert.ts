export const timeConvert = (milisecTime:number, unit:string, onlyTimeValue= false) => {
    const expiryTime = {
        date: Math.floor(milisecTime / 24 / 60 / 60 / 1000),
        hour: Math.floor(milisecTime / 60 / 60 / 1000),
        min: Math.floor(milisecTime / 60 / 1000),
        sec: Math.floor(milisecTime / 1000),
    };
    const unit_KOR = {
        date: "일",
        hour: "시간",
        min: "분",
        sec: "초",
    }

    return onlyTimeValue ? expiryTime[unit] : `${expiryTime[unit]}${unit_KOR[unit]}`;
}


export const timeConvertToMillisec = (time:number, unit:string) =>{
    const t = {
        date: time * 24 * 60 * 60 * 1000,
        hour: time * 60 * 60 * 1000,
        min: time * 60 * 1000,
        sec: time * 1000,
    }

    return t[unit];
};
