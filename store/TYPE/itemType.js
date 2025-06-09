export const general_itemType = {
  ALL: 'ALL',
  RAW: 'RAW',
  COOKED: 'COOKED',
  TOPPING: 'TOPPING',
  SNACK: 'SNACK',
  ETC: 'ETC:',
  KOR: {
    ALL: '전체',
    RAW: '생식',
    COOKED: '화식',
    TOPPING: '토핑',
    SNACK: '간식',
    ETC: '기타',
  },
};

export const itemTypeOption = Object.entries(general_itemType.KOR).map(([key, label]) => ({
  label,
  value: key
}));

export const itemTypeOptionWithoutAll = itemTypeOption.filter(option => option.value !== 'ALL');

export const productType = {
  ALL: 'ALL',
  general: 'GENERAL',
  GENERAL: 'GENERAL',
  subscribe: 'SUBSCRIBE',
  SUBSCRIBE: 'SUBSCRIBE',
  KOR: {
    ALL: '전체',
    general: '일반',
    GENERAL: '일반',
    subscribe: '구독',
    SUBSCRIBE: '구독',
  },
};
