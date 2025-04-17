
export const discountUnitType = {
  FIXED_RATE : 'FIXED_RATE',
  FLAT_RATE : 'FLAT_RATE',
  KOR:{
    FIXED_RATE : '%',
    FLAT_RATE : '원'
  }
}

export const unitSettings = [
  { label: '%', value: discountUnitType.FIXED_RATE },
  { label: '원', value: discountUnitType.FLAT_RATE },
];