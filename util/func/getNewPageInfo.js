import {getData} from '/api/reqData';

export const getNewPageInfo = async (url, pageNum, size) => {
  let newPageInfo;
  const calcedPageIndex = (pageNum - 1).toString();
  // ! IMPORTANT:  page요청 시, index번호 사용
  const res = await getData(`${url}?page=${calcedPageIndex}&size=${size}`);
  const pageInfo = res.data?.page;
  newPageInfo = {
    totalPages: pageInfo.totalPages,
    size: pageInfo.size,
    totalItems: pageInfo.totalElements,
    currentPageIndex: pageInfo.number,
    newItemList: res.data._embedded?.queryBlogsAdminDtoList || {},
    newPageNumber: pageInfo.number + 1,
  };
  return newPageInfo;
};