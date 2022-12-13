export const getDefaultPagenationInfo = (data, itemQuery, option = {pageSize: null}) => {
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
    const curItemList = data._embedded[itemQuery] || [];
    newPageInfo = {
      totalPages: pageData.totalPages,
      size: pageData.size,
      totalItems: pageData.totalElements,
      currentPageIndex: pageData.number,
      newPageNumber: pageData.number + 1,
      newItemList: curItemList,
    };
  }
  
  return newPageInfo;
}