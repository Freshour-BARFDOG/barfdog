import {transformToday} from "/util/func/transformDate";
import {getDiffDateNumber} from "/util/func/getDiffDate";

export const global_searchDateType = {
  lastTime: '1900-01-01', // '가장 오래된 데이터 검색일자'
  lastTimeDiffDate: getDiffDateNumber( '1900-01-01', transformToday()), // '사이트 검색 중 가장 오래된 순 검색 시 사용'
  firstTime: transformToday(), // 오늘
  test: this,
}
