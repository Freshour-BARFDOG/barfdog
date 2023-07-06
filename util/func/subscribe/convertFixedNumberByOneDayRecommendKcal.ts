import {UnitOfDemicalPointOfOneDayRecommendKcalByDatabase} from "@util/func/subscribe/finalVar";

export const convertFixedNumberByOneDayRecommendKcal = (value) => {
    // DB에서 검증 시, 소수점 2자리까지 검증 (소수점 1자리 일 경우, 뒤에 0 필요)
    // ex. 100.6 => 100.60
    return value.toFixed(UnitOfDemicalPointOfOneDayRecommendKcalByDatabase);
};
