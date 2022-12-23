export const getDefaultPagenationInfo = (data, itemQuery, option = {pageSize: null, setInitialize: null}) => {
  if(!data)return;
  let curItemList = [];
  
  let newPageInfo = {
    totalPages: 1,
    size: option.pageSize,
    totalItems: 0,
    currentPageIndex: 0,
    newPageNumber: 1,
    newItemList: [],
  }
  
  if ( data._embedded ) {
    const pageData = data.page;
    curItemList = data._embedded[itemQuery] || [];
    newPageInfo = {
      totalPages: pageData.totalPages,
      size: pageData.size,
      totalItems: pageData.totalElements,
      currentPageIndex: pageData.number,
      newPageNumber: pageData.number + 1,
      newItemList: curItemList,
    };
  }
  
  if(option.setInitialize && typeof option.setInitialize === 'function'){
    const initialize = curItemList.length === 0;
    option.setInitialize(initialize);
  }
  
  return newPageInfo;
}