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
};

export const itemHealthTypeList = [
  {
    label: itemHealthType.KOR.DIARRHEA,
    value: itemHealthType.DIARRHEA,
  },
  {
    label: itemHealthType.KOR.WEIGHT_MANAGEMENT,
    value: itemHealthType.WEIGHT_MANAGEMENT,
  },
  {
    label: itemHealthType.KOR.FATIGUE_RECOVERY,
    value: itemHealthType.FATIGUE_RECOVERY,
  },

  {
    label: itemHealthType.KOR.VOMITING,
    value: itemHealthType.VOMITING,
  },
  {
    label: itemHealthType.KOR.WATER_INTAKE,
    value: itemHealthType.WATER_INTAKE,
  },
  {
    label: itemHealthType.KOR.COAT_CARE,
    value: itemHealthType.COAT_CARE,
  },
  {
    label: itemHealthType.KOR.JOINT_HEALTH,
    value: itemHealthType.JOINT_HEALTH,
  },
  {
    label: itemHealthType.KOR.PUPPY_DEVELOPMENT,
    value: itemHealthType.PUPPY_DEVELOPMENT,
  },
  {
    label: itemHealthType.KOR.SENIOR_HEALTH,
    value: itemHealthType.SENIOR_HEALTH,
  },
];
