export const packageBenefitType = {
  DIAGNOSTIC_DEVICE: {
    NAME: 'DIAGNOSTIC_DEVICE', // 서버에 전송할 이름
    KOR: '진단기기',
    price: 98000,
  },
  TOPPER_RANDOM: {
    NAME: 'TOPPER_RANDOM',
    KOR: '토퍼(랜덤)',
    price: 16000,
  },
};

export const packageBenefitStatusType = {
  AVAILABLE: {
    NAME: 'AVAILABLE',
    KOR: '사용가능',
  },
  REQUESTED: {
    NAME: 'REQUESTED',
    KOR: '요청',
  },
  CANCELLED: {
    NAME: 'CANCELLED',
    KOR: '취소',
  },
  EXPIRED: {
    NAME: 'EXPIRED',
    KOR: '만료',
  },
};
