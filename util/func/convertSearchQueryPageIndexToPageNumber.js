export const convertSearchQueryPageIndexToPageNumber = (searchQuery) => {
  const queryStr = '?page=';
  const isValid = searchQuery.indexOf( queryStr ) !== -1;
  if ( !searchQuery || !isValid ) return;
  
  const targetIndex = queryStr.length;
  const pageNum = Number( searchQuery.substring( targetIndex, targetIndex + 1 ) ) + 1;
  const restStr = searchQuery.substring( targetIndex + 1 );
  return `${queryStr}${pageNum}${restStr}`;
}