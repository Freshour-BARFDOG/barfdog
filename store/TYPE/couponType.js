export const global_couponType = {
  AUTO_PUBLISHED: 'AUTO_PUBLISHED',
  CODE_PUBLISHED: 'CODE_PUBLISHED',
  // GENERAL_PUBLISHED:'GENERAL_PUBLISHED' // ! 삭제: 고객과 협의 하에 사용하지 않기로함
  KOR:{
    AUTO_PUBLISHED: '자동발행', // - 자동발행: 어드민 생성 및 삭제 불가 / 개발자 측에서만 생성가능
    CODE_PUBLISHED: '직접발행', // - 직접발행 : 유저가 코드 입력 후 쿠폰함에 생성
    GENERAL_PUBLISHED:'일반발행', // - 일반발행 : 유저가 코드 입력 후 쿠폰함에 생성
  }
};

export const couponUseType = {
  ALL: 'ALL',
  SUBSCRIBE: 'SUBSCRIBE',
  GENERAL: 'GENERAL',
  KOR: {
    ALL: '전체',
    SUBSCRIBE: '정기구독',
    GENERAL: '일반상품',
  },
};

export const couponActiveType = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
}

export const autoPublishedCouponType = ['정기구독할인쿠폰', '반려견생일쿠폰', '견주생일쿠폰'];
