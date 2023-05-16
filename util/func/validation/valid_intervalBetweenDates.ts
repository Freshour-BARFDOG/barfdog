import {timeConvert, timeConvertToMillisec} from "../timeConvert";

const UnitOptions = {
    date: "date",
    hour: "hour",
    min: "min",
    sec: "sec"
} as const;

type Unit =  keyof typeof UnitOptions;

export const valid_intervalBetweenDates = (fromDate: string, toDate: string, unit: Unit, interval: number) => {
    if (!fromDate || !toDate) return;
    let errorMessage = '';

    //fromDate, toDate : 'yyyy-dd-mm hh:mm:ss';
    const from = new Date(fromDate).getTime();
    const to = new Date(toDate).getTime();

    const diffDateNum = timeConvert(to - from, unit, true);

    if (diffDateNum < interval) {
        errorMessage = `두 일시의 간격은 ${interval ? `${timeConvert(timeConvertToMillisec(interval, unit), unit)} 이상 경과한` : "이후"} 시점이어야 합니다.`;
    }

    return errorMessage;

};
