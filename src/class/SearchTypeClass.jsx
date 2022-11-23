export class SearchTypeClass {
  initialType = '';
  activeType = '';
  typeMap = {
    TITLE: 'title',
    NAME: 'name',
    EMAIL: 'email',
  };
  
  options = [
    {label: '제목', value: this.typeMap.TITLE},
    {label: '이름', value: this.typeMap.NAME},
    {label: '이메일', value: this.typeMap.EMAIL},
  ];
  
  // 초기화
  constructor (initialSearchType = '') {
    this.initialType = initialSearchType;
    this.activeType = initialSearchType;
  }
  
  filterTypeObj (obj) {
    let filterdTypeMap = {};
    for (const key in obj) {
      const val = obj[key];
      const target = Object.values( this.typeMap ).indexOf( key ) >= 0;
      if ( target ) {
        filterdTypeMap[key] = val;
      }
    }
    return filterdTypeMap;
  }
}