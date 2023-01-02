import { transformToday } from '/util/func/transformDate';
import { getDiffDateNumber } from '/util/func/getDiffDate';

const oldestDate = '1900-01-01';
const maxDiffDate = getDiffDateNumber(transformToday(), oldestDate);

const searchDateList = [
  {
    diffDate: 0,
    label: '오늘',
  },
  {
    diffDate: 3,
    label: '3일',
  },
  {
    diffDate: 7,
    label: '7일',
  },
  {
    diffDate: 30,
    label: '30일',
  },
  {
    diffDate: 60,
    label: '60일',
  },
  {
    diffDate: 120,
    label: '120일',
  },
  {
    diffDate: maxDiffDate,
    label: '전체',
  },
];

export const global_searchDateType = {
  firstTime: transformToday(),
  oldestDate: oldestDate,
  maxDiffDate: maxDiffDate, // '사이트 검색 중 가장 오래된 순 검색 시 사용'
  BUTTONS: searchDateList,
};
