
export const global_gradeType = ['브론즈','실버','골드','플래티넘','다이아몬드','더바프'] ;
export const global_gradeType_ENG =  ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'BARF'];

export const gradeTypeOptions = () => {
  const defaultOptions = [{label: "선택", value: ''}];
  const gradeTypes = global_gradeType.map( type => ({label: type, value: type}) );
  return defaultOptions.concat( gradeTypes );
}

export const getGradeList = (gradeFrom = '', gradeTo = '') => {
  let gradeList = [];
  if ( gradeFrom === gradeTo ) {
    gradeList = global_gradeType.filter( type => type === gradeFrom );
  } else {
    const startIdx = global_gradeType.indexOf( gradeFrom );
    const endIdx = global_gradeType.indexOf( gradeTo ) + 1;
    gradeList = global_gradeType.slice( startIdx, endIdx );
  }
  return gradeList;
};
