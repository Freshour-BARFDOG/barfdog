// 1:1 문의내역 카테고리
export const inquiryCategoryType = {
  GENERAL: 'GENERAL',
  REFUND: 'REFUND',
  ERROR_REPORTING: 'ERROR_REPORTING',
  KOR:{
    GENERAL: '일반문의',
    REFUND: '반품/환불',
    ERROR_REPORTING: '오류보고',
  }
};

export const inquiryCategoryOptions = [
  {
    label: inquiryCategoryType.KOR.GENERAL,
    value: inquiryCategoryType.GENERAL,
  },
  {
    label: inquiryCategoryType.KOR.REFUND,
    value: inquiryCategoryType.REFUND,
  },
  {
    label: inquiryCategoryType.KOR.ERROR_REPORTING,
    value: inquiryCategoryType.ERROR_REPORTING,
  },
];
