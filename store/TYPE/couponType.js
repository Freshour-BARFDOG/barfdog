export const global_couponType = {
  AUTO_PUBLISHED: 'AUTO_PUBLISHED',
  CODE_PUBLISHED: 'CODE_PUBLISHED',
  GENERAL_PUBLISHED: 'GENERAL_PUBLISHED', // ! 삭제: 고객과 협의 하에 사용하지 않기로함 --> [24.05] 다시 사용하기로 결정
  PROMOTION_PUBLISHED: 'PROMOTION_PUBLISHED', // 23년 04월 추가 (최초 요구사항정의서 누락된 기능 보완)
  KOR: {
    AUTO_PUBLISHED: '자동발행', // - 자동발행: 어드민 생성 및 삭제 불가 / 개발자 측에서만 생성가능
    CODE_PUBLISHED: '코드쿠폰', // - 직접발행 : 유저가 코드 입력 후 쿠폰함에 생성
    GENERAL_PUBLISHED: '일반쿠폰', // - 일반발행 : 유저가 코드 입력 후 쿠폰함에 생성 (쿠폰코드를 공란으로 입력)
    PROMOTION_PUBLISHED: '프로모션',
  },
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
};

// ! 어드민에서 자동발행쿠폰의 이름, 할인금액, 사용종류, 쿠폰종류 등의 모든 정보는 수정할 수 없음.
export const gradeCouponNames = [
  '등급쿠폰1000원',
  '등급쿠폰2000원',
  '등급쿠폰2500원',
  '등급쿠폰3000원',
  '등급쿠폰4000원',
  '등급쿠폰5000원',
];
export const eventCouponNames = [
  '정기구독할인쿠폰',
  '반려견생일쿠폰',
  '견주생일쿠폰',
];
