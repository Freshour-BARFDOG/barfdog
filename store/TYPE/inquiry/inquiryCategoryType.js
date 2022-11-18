// 1:1 문의내역 카테고리
export const inquiryCategoryType = {
  GENERAL: 'GENERAL',
  REFUND: 'REFUND',
  ERROR_REPORTING: 'ERROR_REPORTING',
};

export const inquiryCategoryOptions = [
  {
    label: '일반문의',
    value: inquiryCategoryType.GENERAL,
  },
  {
    label: '반품/환불',
    value: inquiryCategoryType.REFUND,
  },
  {
    label: '오류보고',
    value: inquiryCategoryType.ERROR_REPORTING,
  },
];
