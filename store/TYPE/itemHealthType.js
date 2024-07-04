export const itemHealthType = {
  DIARRHEA: 'DIARRHEA',
  WEIGHT_MANAGEMENT: 'WEIGHT_MANAGEMENT',
  FATIGUE_RECOVERY: 'FATIGUE_RECOVERY',
  VOMITING: 'VOMITING',
  WATER_INTAKE: 'WATER_INTAKE',
  COAT_CARE: 'COAT_CARE',
  JOINT_HEALTH: 'JOINT_HEALTH',
  PUPPY_DEVELOPMENT: 'PUPPY_DEVELOPMENT',
  SENIOR_HEALTH: 'SENIOR_HEALTH',
  NONE: 'NONE',
  KOR: {
    DIARRHEA: '잦은 설사',
    WEIGHT_MANAGEMENT: '체중 조절',
    FATIGUE_RECOVERY: '피로 회복',
    VOMITING: '잦은 구토',
    WATER_INTAKE: '음수량 부족',
    COAT_CARE: '모질 관리',
    JOINT_HEALTH: '관절 건강',
    PUPPY_DEVELOPMENT: '자견 발육',
    SENIOR_HEALTH: '노령견 건강',
    NONE: '없음',
  },
  DESCRIPTION: {
    DIARRHEA:
      '소화에 부드러운 닭고기 기반의 레시피와 그 외 적합한 상품을 추천드려요',
    WEIGHT_MANAGEMENT:
      '프리미엄 식이요법 레시피와 그 외 적합한 상품을 추천드려요',
    FATIGUE_RECOVERY:
      '피로 회복에 효과적인 레시피와 그 외 적합한 상품을 추천드려요',
    VOMITING:
      '소화하기 부드러운 닭고기 기반의 레시피와 그 외 적합한 상품을 추천드려요',
    WATER_INTAKE:
      '음촉촉한 수분감으로 아이들의 음수량을 증진시킬 수 있는 상품을 추천드려요',
    COAT_CARE: '윤기나는 반려견 모질과 피부 관리에 탁월한 상품을 추천드려요',
    JOINT_HEALTH:
      '관절에 아주 좋은 강황의 커큐민 성분을 담은 상품을 추천드려요',
    PUPPY_DEVELOPMENT:
      '1년 미만의 자견에게 풍부한 영양을 선물할 상품을 추천드려요',
    SENIOR_HEALTH:
      '칼슘과 인 수치가 비교적 낮아 노령견에게도 적합한 상품을 추천드려요',
    NONE: '',
  },
};

export const itemHealthTypeList = [
  {
    label: itemHealthType.KOR.DIARRHEA,
    value: itemHealthType.DIARRHEA,
    description: itemHealthType.DESCRIPTION.DIARRHEA,
  },
  {
    label: itemHealthType.KOR.WEIGHT_MANAGEMENT,
    value: itemHealthType.WEIGHT_MANAGEMENT,
    description: itemHealthType.DESCRIPTION.WEIGHT_MANAGEMENT,
  },
  {
    label: itemHealthType.KOR.FATIGUE_RECOVERY,
    value: itemHealthType.FATIGUE_RECOVERY,
    description: itemHealthType.DESCRIPTION.FATIGUE_RECOVERY,
  },

  {
    label: itemHealthType.KOR.VOMITING,
    value: itemHealthType.VOMITING,
    description: itemHealthType.DESCRIPTION.VOMITING,
  },
  {
    label: itemHealthType.KOR.WATER_INTAKE,
    value: itemHealthType.WATER_INTAKE,
    description: itemHealthType.DESCRIPTION.WATER_INTAKE,
  },
  {
    label: itemHealthType.KOR.COAT_CARE,
    value: itemHealthType.COAT_CARE,
    description: itemHealthType.DESCRIPTION.COAT_CARE,
  },
  {
    label: itemHealthType.KOR.JOINT_HEALTH,
    value: itemHealthType.JOINT_HEALTH,
    description: itemHealthType.DESCRIPTION.JOINT_HEALTH,
  },
  {
    label: itemHealthType.KOR.PUPPY_DEVELOPMENT,
    value: itemHealthType.PUPPY_DEVELOPMENT,
    description: itemHealthType.DESCRIPTION.PUPPY_DEVELOPMENT,
  },
  {
    label: itemHealthType.KOR.SENIOR_HEALTH,
    value: itemHealthType.SENIOR_HEALTH,
    description: itemHealthType.DESCRIPTION.SENIOR_HEALTH,
  },
];
