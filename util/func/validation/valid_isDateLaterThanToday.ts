import {timeConvert} from "@util/func/timeConvert";

type ResultType = string | number;

export const valid_isDateLaterThanToday = (d = "YYYY-MM-DD hh:mm:ss", unit:string, slackTime:number):ResultType => {
    let errorMessage = '';

    const nowDate = new Date();
    const targetDate = new Date(d);

    const now = nowDate.getTime();
    const date = targetDate.getTime();

    if (now + slackTime >= date) {

        errorMessage = `현재보다 ${slackTime ? `최소${timeConvert(slackTime, unit)} 이상 경과한` : "이후"} 시점이어야 합니다.`;
    }

    return errorMessage;

};
