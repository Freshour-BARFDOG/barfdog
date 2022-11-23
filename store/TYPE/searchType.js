import { inquiryCategoryOptions } from './inquiry/inquiryCategoryType';

const onlySearch = {
  ALL: {
    label: '전체',
    value: 'ALL',
  },
};


export const searchType = {
  KEYWORD: {
    NAME: 'title',
  },
  CATEGORY: {
    NAME: 'category',
    options: [onlySearch.ALL, ...inquiryCategoryOptions],
  },
};
